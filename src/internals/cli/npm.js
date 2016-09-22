import childProcess from 'child_process';
import chalk from 'chalk';
import { runCommandSync } from './run-command';
import { info, warn, question } from './stdio';

export type Dependency = {
  name: string,
  version: string,
};

export type MissingDependency = {
  requiree: Dependency,
  requirer: Dependency,
};

/**
 * Returns the list of extraneous and missing dependencies.
 */
export function checkDependencies(): { missing: MissingDependency[], extraneous: Dependency[] } {
  const missing: MissingDependency[] = [];
  const extraneous: Dependency[] = [];

  const result = { missing, extraneous };

  try {
    childProcess.execSync('npm ls', { stdio: 'pipe' });
    return result;
  } catch (e) {
    const out: string = e.stderr.toString();
    if (!out) {
      return result;
    }

    for (const line: string of out.split('\n')) {
      if (!line) {
        continue;
      }

      const missingData = line.match(/^.+peer dep missing: ([^@]+)@([^,]+), required by ([^@]+)@(.+)$/);
      if (missingData) {
        missing.push({
          requiree: {
            name: missingData[1],
            version: missingData[2],
          },
          requirer: {
            name: missingData[3],
            version: missingData[4],
          },
        });

        continue;
      }

      const extraneousData = line.match(/^.+extraneous: ([^@]+)@([^ \/]+)/);
      if (extraneousData) {
        extraneous.push({
          name: extraneousData[1],
          version: extraneousData[2],
        });

        continue;
      }

      warn(`Could not parse line ${line}`);
    }

    return result;
  }
}

export async function installMissingDependency(dep: MissingDependency) {
  // TODO check package.json to see if it is already in it.
  // Also check if requested version matches semver
  // If so then install that one.
  // Otherwise kill process.
  // Also handle "||" options.

  // https://github.com/npm/node-semver
  info(`Installing ${dep.requiree.name}@${dep.requiree.version}, required by ${dep.requirer.name}@${dep.requirer.version}...`);

  let useProd;
  do {
    const result = (await question(`Do you wish to store this dependency in ${chalk.blue('dev')} (0) or ${chalk.blue('prod')} (1, default):\n`)) || '1';

    if (result === '0' || result === 'dev') {
      useProd = false;
    } else if (result === '1' || result === 'prod') {
      useProd = true;
    } else {
      useProd = null;
    }
  } while (useProd === null);

  runCommandSync(`npm install ${dep.requiree.name}@${dep.requiree.version} ${useProd ? '--save' : '--save-dev'}`);
}
