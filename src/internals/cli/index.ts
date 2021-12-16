import { dirname } from 'path';
import { fileURLToPath } from 'url';
import framework from '@reworkjs/core/_internal_/framework-metadata';
import { levels } from '@reworkjs/core/logger';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { importAll } from '../util/require-util.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

process.on('unhandledRejection', reason => {
  console.error('Unhandled Rejections:');
  console.error(reason);

  process.exit(1);
});

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const instance = yargs(hideBin(process.argv))
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
const commandModules = await importAll(`${__dirname}/commands/**/*.{js,ts}`);

for (const commandModule of commandModules.values()) {
  if (typeof commandModule.default === 'function') {
    commandModule.default(instance);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
instance.demandCommand(1).recommendCommands().argv;

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
