import childProcess from 'child_process';
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

// const babelNode = require.resolve('.bin/babel-node');
//
// const babelArgs = [];
// try {
//   const babelConfig = JSON.parse(requireRawRoot('.babelrc'));
//
//   delete babelConfig.env;
//
//   for (const configKey of Object.keys(babelConfig)) {
//     babelArgs.push(`--${configKey}`);
//
//     const configValue = babelConfig[configKey];
//     if (Array.isArray(configValue)) {
//       babelArgs.push(configValue.join(','));
//     } else {
//       babelArgs.push(JSON.stringify(babelConfig[configKey]));
//     }
//   }
// } catch (e) {
//   console.error(e);
// }
//
// /**
//  * Run a file using babel-node
//  * @param file - The file to run
//  * @param args - The arg to pass to the process.
//  */
// export function runBabelNodeSync(file: string, args: string[] = []) {
//   runCommandSync(`${babelNode} ${babelArgs.join(' ')} -- ${file} ${args.join(' ')}`);
// }
