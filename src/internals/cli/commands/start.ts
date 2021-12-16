import childProcess from 'child_process';
import framework from '@reworkjs/core/_internal_/framework-metadata';
import logger from '@reworkjs/core/logger';
import getPort from 'get-port';
import type Yargs from 'yargs';
import { chalkEnvVar } from '../../../shared/chalk.js';
import builders from '../../webpack/builders.js';
import CliSplitView from '../CliSplitView.js';
import featureHelp from '../get-webpack-features-help.js';
import { listenMsg } from '../process.js';

/**
 * This command registers a "start" command that launches builds and serve the app.
 *
 * With Pre-rendering:
 *  PROD:
 *    Build Server & Client
 *    Launch "Server" with pre-rendering. (Server serves assets and pre-renders).
 *  DEV:
 *    Build Server & Client.
 *    Launch HMR Server for client? -- for front-end HMR.
 *    Launch Server for pre-rendering.
 *    HMR Server (back-end HMR).
 *
 * Without Pre-rendering:
 *  PROD:
 *    rjs build client
 *    Serve assets & index.html
 *  DEV:
 *    Build Client
 *    Delegate to webpack-dev-middleware
 */
export default function registerCommand(cli: Yargs.Argv) {

  cli
    .command('start', 'Launches the application', yargs => {
      yargs
        .option('ssr', {
          type: 'boolean',
          default: false,
          describe: 'Enable server-side rendering',
        })
        .option('split', {
          type: 'boolean',
          default: false,
          describe: 'Enable terminal split-view',
        })
        .option('port', {
          type: 'number',
          default: 3000,
          describe: 'The port the server will listen to',
        })
        .option(featureHelp)
        .parserConfiguration({ 'populate--': true });
    }, async argv => {
      argv['--'] = argv['--'] || [];

      logger.info(`Launching app in ${chalkEnvVar(process.env.NODE_ENV)} mode...`);

      process.env.WATCH = String(process.env.NODE_ENV === 'development');

      if (!argv.ssr) {
        return runServerWithoutPrerendering(argv);
      }

      return runServerWithPrerendering(argv);
    });
}

async function runServerWithoutPrerendering(options) {
  if (!process.argv.includes('--port')) {
    process.argv.push('--port', options.port);
  }

  // $FlowIgnore
  const promises = [import(builders.client)];

  if (process.env.NODE_ENV === 'production') {
    // the development builder launches its own server which supports HMR.
    // in production, load the standalone server.
    promises.push(import('../../../framework/server/launch-http-server.js'));
  }

  await Promise.all(promises);
}

async function runServerWithPrerendering(options) {

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
