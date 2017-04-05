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
