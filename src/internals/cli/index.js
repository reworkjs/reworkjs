import program from 'commander';
import requireAll from 'require-all';
import '../../shared/regenerator';
import framework from '../../shared/framework-metadata';
import { getDefault } from '../../shared/util/ModuleUtil';
import levels from '../../shared/logger/levels';

// register all commands.
const commands = requireAll({
  dirname: `${__dirname}/commands`,
  filter: /.*\.js$/,
  recursive: true,
});

program
  .version(framework.version)
  .option('--verbose [verbose]', `set logger verbosity to one of {${Object.keys(levels).join(', ')}}`, 'info');

for (const file of Object.keys(commands)) {
  const registerCommand = getDefault(commands[file]);
  if (typeof registerCommand === 'function') {
    registerCommand(program);
  }
}

program.parse(process.argv);

/*
 ## `build`

 Build DLLs

 `cross-env NODE_ENV=production webpack --config framework/internals/webpack/webpack.prod.babel.js --color -p`

 ## `build dll`

 `babel-node -- ./framework/internals/scripts/dependencies.js`

 ## `build server`

 `babel server -d .build/server && babel internals -d .build/internals`

 ## `extract-intl`

 `babel-node -- ./framework/internals/scripts/extract-intl.js`

 ## `generate`

 `plop --plopfile internals/generators/index.js`

 ## `pagespeed`

 `node ./internals/scripts/pagespeed.js`

 ## `test`

 ## `test --coverage`
 */
