import childProcess from 'child_process';

const babelNode = require.resolve('.bin/babel-node');

/**
 * Run a file using babel-node
 * @param file - The file to run
 * @param args - The arg to pass to the process.
 */
export function runBabelNodeSync(file: string, args: string[] = []) {
  try {
    childProcess.execSync(`${babelNode} -- ${file} ${args.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (e) {
    if (!e.status) {
      throw e;
    }

    process.exit(e);
  }
}
