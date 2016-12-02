import requireAll from 'require-all';
import { getDefault } from '../../shared/util/ModuleUtil';
import { getCommand } from './index';

const commands = {
  // lint([mode]) {
    // staged
    // script
    // style
  // },

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

  // test(ignored, options) {

  // },

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

const commandFiles = requireAll(`${__dirname}/commands`);
for (const commandName of Object.getOwnPropertyNames(commandFiles)) {
  const commandFile = commandFiles[commandName];

  const command = getDefault(commandFile);

  if (commandFile.usage) {
    command.usage = commandFile.usage;
  }

  Object.defineProperty(commands, commandName, {
    value: command,
  });
}

export default commands;
