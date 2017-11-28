// @flow

import chalk from 'chalk';
import cli from 'yargs';
import requireAll from 'require-all';
import framework from '../../shared/framework-metadata';
import { getDefault } from '../../shared/util/ModuleUtil';
import levels from '../../shared/logger/levels';

chalk.enabled = true;

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
 ## `build`

 Build DLLs

 `cross-env NODE_ENV=production webpack --config framework/internals/webpack/webpack.prod.babel.js --color -p`

 ## `build dll`

 `babel-node -- ./framework/internals/scripts/dependencies.js`

 ## `extract-intl`

 `babel-node -- ./framework/internals/scripts/extract-intl.js`

 ## `generate`

 `plop --plopfile internals/generators/index.js`

 ## `pagespeed`

 `node ./internals/scripts/pagespeed.js`

 ## `test`

 ## `test --coverage`
 */
