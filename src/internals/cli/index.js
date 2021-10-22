import cli from 'yargs';
import requireAll from 'require-all';
import framework from '../../shared/framework-metadata';
import { getDefault } from '../../shared/util/ModuleUtil';
import levels from '../../shared/logger/levels';

process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejections:');
  console.error(reason);

  process.exit(1);
});

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

cli
  .strict()
  .version(framework.version)
  .option('v', {
    alias: 'verbose',
    default: 'info',
    describe: `set logger verbosity.`,
    type: 'string',
    choices: Object.keys(levels),
  });

// register all commands.
const commands = requireAll({
  dirname: `${__dirname}/commands`,
  filter: /.*\.js$/,
  recursive: true,
});

for (const file of Object.keys(commands)) {
  const registerCommand = getDefault(commands[file]);
  if (typeof registerCommand === 'function') {
    registerCommand(cli);
  }
}

// eslint-disable-next-line no-unused-expressions
cli.demandCommand(1).recommendCommands().argv;

/*
TODO cli

# binary methods:

DLL?

## `NODE_ENV=production rjs start`

Build DLLs

Build server

`cross-env NODE_ENV=production node .build/server`

## `rjs extract-intl`

`babel-node -- ./framework/internals/scripts/extract-intl.js`
 */
