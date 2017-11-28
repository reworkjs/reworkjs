// @flow

import chalk from 'chalk';
import program from 'commander';
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

// register all commands.
const commands = requireAll({
  dirname: `${__dirname}/commands`,
  filter: /.*\.js$/,
  recursive: true,
});

program
  .version(framework.version)
  .option('--verbose [verbose]', `set logger verbosity to one of {${Object.keys(levels).join(', ')}}`, 'info')
  .option('--env <env>', 'Overwrite NODE_ENV value');

for (const file of Object.keys(commands)) {
  const registerCommand = getDefault(commands[file]);
  if (typeof registerCommand === 'function') {
    registerCommand(program);
  }
}

program.parseOptions(process.argv);

setEnv(program.env);

program.parse(process.argv);

function setEnv(env = process.env.NODE_ENV || 'production') {

  if (env === 'dev') {
    process.env.NODE_ENV = 'development';
  } else if (env === 'prod') {
    process.env.NODE_ENV = 'production';
  } else {
    process.env.NODE_ENV = env;
  }

  return process.env.NODE_ENV;
}

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
