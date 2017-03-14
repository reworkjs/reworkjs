import childProcess from 'child_process';
import path from 'path';
import { merge } from 'lodash';
import Blessed from 'blessed';
import framework from '../../../shared/framework-metadata';
import { info } from '../stdio';

export default function registerCommand(commander) {

  commander
    .command('start [mode]')
    .description('Launches the application')
    .option('--no-prerendering', 'Disable server-side rendering')
    .option('--port', 'The port the server will listen to', Number)
    .option('--tunnel', 'The port of the tunnel', Number)
    .option('--no-split', 'Disable terminal split-view')
    .action((mode = process.env.NODE_ENV || 'production', options) => {
      if (mode === 'dev') {
        process.env.NODE_ENV = 'development';
      } else if (mode === 'prod') {
        process.env.NODE_ENV = 'production';
      } else {
        process.env.NODE_ENV = mode;
      }

      info(`Launching app in ${process.env.NODE_ENV} mode...`);

      if (!options.prerendering) {
        return runServerWithoutPrerendering();
      }

      return runServerWithPrerendering(options.split);
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
function runServerWithPrerendering(split) {

  const serverBuilder = fork('Server', path.normalize(`${__dirname}/../build-webpack-server.js`), split ? 'pipe' : 'inherit');
  const clientBuilder = fork('Client', path.normalize(`${__dirname}/../build-webpack-client.js`), split ? 'pipe' : 'inherit');

  if (!split) {
    return;
  }

  const screen = Blessed.screen({
    smartCSR: true,
    title: framework.name,
    dockBorders: true,
  });

  const serverOutput = simpleBox(screen, 'server', {
    left: 0,
  });

  const clientOutput = simpleBox(screen, 'client', {
    right: 0,
  });

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.render();

  redirect(serverBuilder, serverOutput, screen);
  redirect(clientBuilder, clientOutput, screen);
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

function fork(name, modulePath, out) {
  return childProcess.fork(modulePath, process.argv, {
    stdio: ['inherit', out, out, 'ipc'],
    env: Object.assign(Object.create(process.env), {
      PROCESS_NAME: name,
    }),
  });
}

function runServerWithoutPrerendering() {
  return require('../../../framework/server/init'); // eslint-disable-line
}

function simpleBox(screen, name, otherParams) {

  const outerBox = Blessed.box(merge({
    top: 0,
    width: '50%',
  }, otherParams));

  const titleBox = Blessed.text({
    content: name,
    width: '100%',
    top: 1,
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
    top: 2,
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

  screen.append(outerBox);

  return innerBox;
}
