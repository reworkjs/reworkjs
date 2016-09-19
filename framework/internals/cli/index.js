import minimist from 'minimist';
import '../../common/load-polyfills';
import commands from './commands';

const argv = minimist(process.argv.slice(2));
const { _: mainArgs, ...otherArgs } = argv;
const commandName = mainArgs[0] || commands.help.name;
const params = mainArgs.splice(1);

/**
 * Returns the command matching name, or die.
 * @param name - The name of the command.
 * @returns The command.
 */
export function getCommand(name: string): Function {
  if (Object.prototype.hasOwnProperty.call(commands, name)) {
    return commands[name];
  }

  console.error(`Unknown command ${JSON.stringify(name)}`);
  console.info('Use `help` for a list of commands');
  process.exit(1);
}

(async function () {
  try {
    await getCommand(commandName)(params, otherArgs);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}());

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
