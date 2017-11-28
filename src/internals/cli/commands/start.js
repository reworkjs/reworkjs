// @flow

import childProcess from 'child_process';
import chalk from 'chalk';
import getPort from 'get-port';
import framework from '../../../shared/framework-metadata';
import logger from '../../../shared/logger';
import builders from '../../webpack/builders';
import { listenMsg } from '../process';
import CliSplitView from '../CliSplitView';
import featureHelp from '../get-webpack-features-help';

export default function registerCommand(cli) {

  cli
    .command('start', 'Launches the application', yargs => {
      yargs
        .option('prerendering', {
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
        .option('tunnel', {
          type: 'number',
          default: -1,
          describe: 'The port of the tunnel -- -1 to disable',
        })
        .option(...featureHelp);
    }, argv => {
      argv.verbose = cli.verbose;

      logger.info(`Launching app in ${chalk.magenta(process.env.NODE_ENV)} mode...`);

      process.env.WATCH = String(process.env.NODE_ENV === 'development');

      if (!argv.prerendering) {
        return runServerWithoutPrerendering(argv);
      }

      logger.info(`You can disable server-side rendering using ${chalk.blue('--no-prerendering')}.`);
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
    promises.push(import('../../../framework/server/launch-http-server'));
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

  const preRenderingPort = await getPort();

  // TODO: on dead process, ask user if they wish to relaunch them. Then do. Or don't.
  children.clientBuilder = childProcess.fork(builders.client, [
    '--port', options.port, '--prerendering-port', preRenderingPort, '--verbose', options.verbose,
  ], {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'ClientBuilder',
    }),
  });

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

  listenMsg(children.serverBuilder, 'launch', data => {
    const exe = data.exe;

    if (!exe) {
      throw new TypeError('received command "launch" from server-builder but did not receive the entry point to launch.');
    }

    if (children.serverInstance) {
      // send HMR signal.
      children.serverInstance.kill('SIGUSR2');
    } else {
      startPreRenderingServer({ children, exe, options, preRenderingPort, splitView, out });
    }
  });
}

function startPreRenderingServer(args) {
  const { children, exe, options, preRenderingPort, splitView, out } = args;

  children.serverInstance = childProcess.fork(exe, [
    '--port', preRenderingPort, '--hide-http', '--verbose', options.verbose,
  ], {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'Server',
    }),
  });

  listenMsg(children.serverInstance, 'restart', () => {
    children.serverInstance.kill();
    startPreRenderingServer(args);
  });

  if (splitView) {
    splitView.addScreen('server', children.serverInstance);
  }
}
