import '../../shared/regenerator';
import argv from '../../shared/argv';
import logger from '../../shared/logger';
import commandList from './command-list';

const { _: mainArgs, ...otherArgs } = argv;
const commandName = mainArgs[0] || commandList.help.name;
const params = mainArgs.splice(1);

/**
 * Returns the command matching name, or die.
 * @param name - The name of the command.
 * @returns The command.
 */
export function getCommand(name: string): Function {
  if (Object.prototype.hasOwnProperty.call(commandList, name)) {
    return commandList[name];
  }

  logger.error(`Unknown command ${JSON.stringify(name)}`);
  logger.info('Use `help` for a list of commands');
  process.exit(1);
}

(async function main() {
  try {
    await getCommand(commandName)(params, otherArgs);
  } catch (e) {
    logger.error(e);
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
