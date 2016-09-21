import childProcess from 'child_process';
import { requireRawRoot } from '../../util/RequireUtil';
import { info } from './stdio';

/**
 * Runs a command synchronously.
 *
 * @param command - The command to execute.
 */
export function runCommandSync(command: String) {
  info(`> Running ${command}`);

  try {
    return childProcess.execSync(command, { stdio: 'inherit' });
  } catch (e) {
    if (!e.status) {
      throw e;
    }

    process.exit(e);
  }
}

const babelNode = require.resolve('.bin/babel-node');
const babelConfig = JSON.parse(requireRawRoot('.babelrc'));

delete babelConfig.env;

const localArgs = [];
for (const configKey of Object.keys(babelConfig)) {
  localArgs.push(`--${configKey}`);

  const configValue = babelConfig[configKey];
  if (Array.isArray(configValue)) {
    localArgs.push(configValue.join(','));
  } else {
    localArgs.push(JSON.stringify(babelConfig[configKey]));
  }
}

/**
 * Run a file using babel-node
 * @param file - The file to run
 * @param args - The arg to pass to the process.
 */
export function runBabelNodeSync(file: string, args: string[] = []) {
  runCommandSync(`${babelNode} ${localArgs.join(' ')} -- ${file} ${args.join(' ')}`);
}
