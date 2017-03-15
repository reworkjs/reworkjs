import childProcess from 'child_process';
import path from 'path';
import { merge } from 'lodash';
import Blessed from 'blessed';
import getPort from 'get-port';
import framework from '../../../shared/framework-metadata';
import { info } from '../stdio';

export default function registerCommand(commander) {

  commander
    .command('start')
    .description('Launches the application')
    .option('--no-prerendering', 'Disable server-side rendering')
    .option('--port <port>', 'The port the server will listen to', Number, 3000)
    .option('--tunnel <tunnel_port>', 'The port of the tunnel', Number, -1)
    .option('--no-split', 'Disable terminal split-view')
    .option('--env <env>', 'Overwrite NODE_ENV value', String, process.env.NODE_ENV || 'production')
    .action(options => {

      const env = options.env;
      if (env === 'dev') {
        process.env.NODE_ENV = 'development';
      } else if (env === 'prod') {
        process.env.NODE_ENV = 'production';
      } else {
        process.env.NODE_ENV = env;
      }

      info(`Launching app in ${process.env.NODE_ENV} mode...`);

      if (!options.prerendering) {
        return runServerWithoutPrerendering();
      }

      return runServerWithPrerendering(options);
    });
}

/**
 * Need:
 * - Start a client build process
 * - Start a server build process
 * - Start the server
 * - Reload the server on rebuild if HMR did not work
 *
 * - The server needs to communicate with the client build process (needs to know the build status)
 */
async function runServerWithPrerendering(options) {

  const out = options.split ? 'pipe' : 'inherit';

  const prerenderingPort = await getPort();

  const clientBuilder = childProcess.fork(path.normalize(`${__dirname}/../build-webpack-client.js`), ['--port', options.port, '--prerendering-port', prerenderingPort], {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'ClientBuilder',
    }),
  });

  const serverBuilder = childProcess.fork(path.normalize(`${__dirname}/../build-webpack-server.js`), process.argv, {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: 'ServerBuilder',
    }),
  });

  let serverInstance;
  let serverOutput;
  serverBuilder.on('message', data => {
    if (data == null || typeof data !== 'object' || !data.cmd) {
      return;
    }

    if (data.cmd !== 'launch') {
      return;
    }

    if (!data.exe) {
      return;
    }

    if (serverInstance) {
      serverInstance.kill();
    }

    serverInstance = childProcess.fork(data.exe, ['--port', prerenderingPort], {
      stdio: ['inherit', out, out, 'ipc'],
      env: Object.assign(Object.create(process.env), {
        PROCESS_NAME: 'Server',
      }),
    });

    if (serverOutput) {
      redirect(serverInstance, serverOutput.inner, screen);
    }
  });

  if (!options.split) {
    return;
  }

  const screen = Blessed.screen({
    smartCSR: true,
    title: framework.name,
    dockBorders: true,
  });

  const clientBuilderOutput = simpleBox(screen, 'client builder', {
    right: 0,
    top: 0,
    width: '50%',
  });

  const serverWrapper = Blessed.box({
    top: 0,
    width: '50%',
  });

  const serverBuilderOutput = simpleBox(screen, 'server builder', {
    left: 0,
    top: 0,
    height: '50%',
  });

  serverOutput = simpleBox(screen, 'server instance', {
    left: 0,
    top: '50%',
    height: '50%',
  });

  serverWrapper.append(serverOutput.outer);
  serverWrapper.append(serverBuilderOutput.outer);

  screen.append(serverWrapper);
  screen.append(clientBuilderOutput.outer);

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.render();

  redirect(serverBuilder, serverBuilderOutput.inner, screen);
  redirect(clientBuilder, clientBuilderOutput.inner, screen);
}

function redirect(child, subTerminal, screen) {

  child.stdout.on('data', data => {
    const msg = data.toString().trim();

    subTerminal.pushLine(msg);
    screen.render();
  });

  child.stderr.on('data', data => {
    const msg = data.toString().trim();

    subTerminal.pushLine(`{red-bg}${msg}\n{/}`);
    screen.render();
  });

  child.on('close', code => {
    subTerminal.pushLine(`\n{${code === 0 ? 'green' : 'red'}-bg}\nProcess completed ${code === 0 ? 'Successfully' : `with error code ${code}`}\n{/}`);
    screen.render();
  });
}

function runServerWithoutPrerendering() {
  return require('../../../framework/server/init'); // eslint-disable-line
}

function simpleBox(screen, name, otherParams) {

  const outerBox = Blessed.box(otherParams);

  const titleBox = Blessed.text({
    content: name,
    width: '100%',
    top: 0,
    left: 1,
    style: {
      fg: 'white',
    },
  });

  const innerBox = Blessed.box({
    tags: true,
    border: {
      type: 'line',
    },
    scrollable: true,
    mouse: true,
    keys: true,
    // alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      inverse: true,
    },
    top: 1,
    width: '100%',
    // height: '80%',
    style: {
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  outerBox.append(titleBox);
  outerBox.append(innerBox);

  return { outer: outerBox, inner: innerBox };
}
