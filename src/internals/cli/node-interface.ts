import type { ChildProcess } from 'child_process';
import childProcess from 'child_process';
import getPort from 'get-port';
import { launchProcess, runProcess } from '../processes/process-list.js';
import CliSplitView from './CliSplitView.js';
import { listenMsg, waitForMessage } from './process.js';

export type TStartServerOptions = {
  ssr?: boolean,
} & TCommonStartServerOptions;

type TCommonStartServerOptions = {
  ci?: boolean,
  port?: number,
  appArgv?: string[],
  split?: boolean,
  env: string,
};

class App {
  readonly #port: number;
  readonly #childProcesses: ChildProcess[];

  constructor(port: number, childProcesses: ChildProcess[]) {
    this.#port = port;
    this.#childProcesses = childProcesses;
  }

  getPort() {
    return this.#port;
  }

  close() {
    for (const child of this.#childProcesses) {
      child.kill();
    }
  }
}

export async function startApp(options: TStartServerOptions): Promise<App> {
  const { ssr = false, ...passDown } = options;

  if (!ssr) {
    return startAppWithoutSsr(passDown);
  }

  return startAppWithSsr(options);
}

async function startAppWithoutSsr(options: TCommonStartServerOptions) {
  const port: number = options.port ?? await getPort();

  const argv = ['--port', String(port)];

  let appProcess: ChildProcess;

  if (options.env === 'production' || options.env === 'test') {
    await runProcess('buildClient', {
      env: options.env,
      argv,
    });

    appProcess = launchProcess('startClient', {
      env: options.env,
      argv,
    });

    await waitForMessage(appProcess, 'accepting-connections');
  } else {
    appProcess = launchProcess('startClientWatch', {
      env: options.env,
      argv,
    });
  }

  return new App(port, [appProcess]);
}

async function startAppWithSsr(options: TCommonStartServerOptions) {

  const children = {};

  process.on('exit', () => {
    for (const childName of Object.keys(children)) {
      const child = children[childName];

      if (child) {
        child.kill();
      }
    }
  });

  const out = options.split ? 'pipe' : 'inherit';

  const preRenderingPort = process.env.NODE_ENV === 'development' ? await getPort() : options.port;

  // TODO: on dead process, ask user if they wish to relaunch them. Then do. Or don't.

  // Launch Client Builder
  const clientBuilderArgv = ['--verbose', options.verbose];

  if (process.env.NODE_ENV === 'development') {
    // in WATCH (dev) mode, the front-end server is handled by the ClientBuilder process
    // running on --port, and dispatching to --ssr-port for routes that need to be pre-rendered.

    clientBuilderArgv.push('--port', options.port, '--ssr-port', preRenderingPort);
  }

  // pass all CLI arguments after `--` as-is. Builder will parse them and provide them as globals
  if (options['--'].length > 0) {
    clientBuilderArgv.push('--', ...options['--']);
  }

  children.clientBuilder = childProcess.fork(builders.client, clientBuilderArgv, {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'ClientBuilder',
    }),
  });

  // Launch Server Builder
  children.serverBuilder = childProcess.fork(builders.server, process.argv, {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'ServerBuilder',
    }),
  });

  let splitView;
  if (options.split) {
    splitView = new CliSplitView(framework.name);

    splitView.addScreen('server builder', children.serverBuilder);
    splitView.addScreen('client builder', children.clientBuilder);
  }

  // Launch Server once it has been built
  listenMsg(children.serverBuilder, 'built', data => {
    const exe = data.exe;

    if (!exe) {
      throw new TypeError('received command "launch" from server-builder but did not receive the entry point to launch.');
    }

    if (children.serverInstance) {
      // server process already exists, this is a re-build. Send Hot Module Replacement signal.
      children.serverInstance.kill('SIGUSR2');
    } else {
      startPreRenderingServer({ children, exe, options, preRenderingPort, splitView, out });
    }
  });
}

function startPreRenderingServer(args) {
  const { children, exe, options, preRenderingPort, splitView, out } = args;

  // Launch pre-rendering server that was just built (exe)
  const serverArgs = [
    '--verbose', options.verbose,
    '--ssr',
  ];

  if (process.env.NODE_ENV === 'development') {
    // in WATCH (dev) mode, the front-end server is handled by the ClientBuilder process
    // which dispatches to the pre-rendering server for non-asset routes.
    serverArgs.push(
      '--hide-http',
      '--port', preRenderingPort,
    );
  } else {
    serverArgs.push('--port', options.port);
  }

  children.serverInstance = childProcess.fork(exe, serverArgs, {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'Server',
    }),
  });

  // Re-launch pre-rendering server (for when HMR fails).
  listenMsg(children.serverInstance, 'restart', () => {
    children.serverInstance.kill();
    startPreRenderingServer(args);
  });

  if (splitView) {
    splitView.addScreen('server', children.serverInstance);
  }
}
