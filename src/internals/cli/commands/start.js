/**
 * Need:
 * - Start a client build process
 * - Start a server build process
 * - Start the server
 * - Reload the server on rebuild if HMR did not work
 *
 * - The server needs to communicate with the client build process (needs to know the build status)
 */
import childProcess from 'child_process';
import chalk from 'chalk';
import Blessed from 'blessed';
import getPort from 'get-port';
import framework from '../../../shared/framework-metadata';
import logger from '../../../shared/logger';
import builders from '../../webpack/builders';
import { listenMsg } from '../process';
import CliSplitView from '../CliSplitView';

chalk.enabled = true;

export default function registerCommand(commander) {

  commander
    .command('start')
    .description('Launches the application')
    .option('--no-prerendering', 'Disable server-side rendering')
    .option('--port <port>', 'The port the server will listen to', Number, 3000)
    .option('--tunnel <tunnel_port>', 'The port of the tunnel', Number, -1)
    .option('--no-split', 'Disable terminal split-view')
    .action(options => {

      options.verbose = commander.verbose;

      logger.info(`Launching app in ${chalk.magenta(process.env.NODE_ENV)} mode...`);

      process.env.WATCH = process.env.NODE_ENV === 'development';

      if (!options.prerendering) {
        return runServerWithoutPrerendering(options);
      }

      logger.info(`You can disable server-side rendering using ${chalk.blue('--no-prerendering')}.`);
      return runServerWithPrerendering(options);
    });
}

async function runServerWithoutPrerendering(options) {
  if (!process.argv.includes('--port')) {
    process.argv.push('--port', options.port);
  }

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
