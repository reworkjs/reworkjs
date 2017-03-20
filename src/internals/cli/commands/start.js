import childProcess from 'child_process';
import chalk from 'chalk';
import Blessed from 'blessed';
import getPort from 'get-port';
import framework from '../../../shared/framework-metadata';
import logger from '../../../shared/logger';
import builders from '../../webpack/builders';

chalk.enabled = true;

/**
 * Need:
 * - Start a client build process
 * - Start a server build process
 * - Start the server
 * - Reload the server on rebuild if HMR did not work
 *
 * - The server needs to communicate with the client build process (needs to know the build status)
 */

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

  await Promise.all([
    import(builders.client),
    import('../../../framework/server/launch-http-server'),
  ]);
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

  const prerenderingPort = await getPort();

  // TODO: on dead process, ask user if they wish to relaunch them. Then do. Or don't.
  children.clientBuilder = childProcess.fork(builders.client, [
    '--port', options.port, '--prerendering-port', prerenderingPort, '--verbose', options.verbose,
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

  // TODO hot update serverInstance using "webpack/hot/signal"
  let serverOutput;
  children.serverBuilder.on('message', data => {
    if (data == null || typeof data !== 'object' || !data.cmd) {
      return;
    }

    if (data.cmd !== 'launch') {
      return;
    }

    if (!data.exe) {
      return;
    }

    if (children.serverInstance) {
      children.serverInstance.kill();
    }

    children.serverInstance = childProcess.fork(data.exe, [
      '--port', prerenderingPort, '--hide-http', '--verbose', options.verbose,
    ], {
      stdio: ['inherit', out, out, 'ipc'],
      env: Object.assign(Object.create(process.env), {
        PROCESS_NAME: 'Server',
      }),
    });

    if (serverOutput) {
      redirect(children.serverInstance, serverOutput.inner, screen);
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

  const clientBuilderOutput = simpleBox('client builder', {
    right: 0,
    top: 0,
    width: '50%',
  });

  const serverWrapper = Blessed.box({
    top: 0,
    width: '50%',
  });

  const serverBuilderOutput = simpleBox('server builder', {
    left: 0,
    top: 0,
    height: '50%',
  });

  serverOutput = simpleBox('server instance', {
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

  redirect(children.serverBuilder, serverBuilderOutput.inner, screen);
  redirect(children.clientBuilder, clientBuilderOutput.inner, screen);
}

function redirect(child, subTerminal, screen) {

  child.stdout.on('data', data => {
    // remove final \r\n added by writeln.
    const msg = data.toString().replace(/(\r\n|\n|\r)$/, '');

    subTerminal.pushLine(msg);
    screen.render();
  });

  child.stderr.on('data', data => {
    // remove final \r\n added by writeln.
    const msg = data.toString().replace(/(\r\n|\n|\r)$/, '');

    subTerminal.pushLine(`{red-bg}${msg}\n{/}`);
    screen.render();
  });

  child.on('close', code => {
    if (code == null) {
      subTerminal.pushLine('\n{blue-bg}\nProcess terminated\n{/}');
    } else {
      subTerminal.pushLine(`\n{${code === 0 ? 'green' : 'red'}-bg}\nProcess completed ${code === 0 ? 'Successfully' : `with error code ${code}`}\n{/}\n`);
    }

    screen.render();
  });
}

function simpleBox(name, otherParams) {

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
