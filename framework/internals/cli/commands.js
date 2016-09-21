import getPort from 'get-port';
import { resolveRoot } from '../../util/RequireUtil';
import { runBabelNodeSync } from './run-command';
import install from './commands/install';
import { getCommand } from './index';

const commands = {
  install() {
    return install();
  },

  lint([mode]) {
    // staged
    // script
    // style
  },

  async start([mode], otherArgs) {
    if (mode === 'dev' || mode === 'development') {
      console.info('Launching app in development mode...');

      process.env.NODE_ENV = 'development';

      const args = process.argv.splice(4);
      if (!otherArgs.port) {
        args.push('--port', await getPort());
      }

      runBabelNodeSync(resolveRoot('framework/server'), args);

      return;
    }

    console.error(`Unknown mode ${mode}`);
    process.exit(1);

    // prod || production
    // tunnel
  },

  clean() {

  },

  build() {
    // dll
    // server
  },

  'extract-intl'() {

  },

  generate() {

  },

  pagespeed() {

  },

  test(ignored, options) {

  },

  help([commandName]) {
    if (!commandName) {
      console.info('List of available commands: ');
      console.info(Object.getOwnPropertyNames(commands).join(' - '));
      console.info('Use `help <command>` for details on a specific command');

      return;
    }

    const command = getCommand(commandName);
    console.info(`${JSON.stringify(commandName)} usage:`);
    if (command.usage) {
      console.info();
      console.info(command.usage);
    } else {
      console.warn('Not available.');
    }
  },
};

commands.start.usage = `Accepted options: --port
Possible modes: dev, prod, tunnel`;

export default commands;
