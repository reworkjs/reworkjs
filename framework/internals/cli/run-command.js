import childProcess from 'child_process';

/**
 * Runs a command synchronously.
 *
 * @param command - The command to execute.
 */
export function runCommandSync(command: String) {
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

/**
 * Run a file using babel-node
 * @param file - The file to run
 * @param args - The arg to pass to the process.
 */
export function runBabelNodeSync(file: string, args: string[] = []) {
  runCommandSync(`${babelNode} -- ${file} ${args.join(' ')}`);
}
