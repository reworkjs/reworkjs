import childProcess from 'child_process';
import chalk from 'chalk';
import groupBy from 'lodash/groupBy';
import { runCommandSync } from './run-command';
import { info, warn, question } from './stdio';

export type Dependency = {
  name: string,
  version: string,
};

export type MissingDependency = {
  [key: string]: Dependency, // version => requirer
};

/**
 * Returns the list of extraneous and missing dependencies.
 */
export function checkDependencies(): { missing: { [key: string]: MissingDependency }, extraneous: Dependency[] } {
  const missing = [];
  const extraneous: Dependency[] = [];

  const out = getMissingDepStr();
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

    const extraneousData = line.match(/^.+extraneous: ([^@]+)@([^ /]+)/);
    if (extraneousData) {
      extraneous.push({
        name: extraneousData[1],
        version: extraneousData[2],
      });

      continue;
    }

    warn(`Could not parse line ${JSON.stringify(line)}`);
  }

  const result = {
    missing: groupBy(missing, missingDep => missingDep.requiree.name),
    extraneous,
  };

  for (const depName of Object.keys(result.missing)) {
    const dep = result.missing[depName];
    const newDep: MissingDependency = {};

    for (const version of dep) {
      newDep[version.requiree.version] = version.requirer;
    }

    result.missing[depName] = newDep;
  }

  return result;
}

function getMissingDepStr(): ?string {
  try {
    childProcess.execSync('npm ls', { stdio: 'pipe' });
    return '';
  } catch (e) {
    return e.stderr.toString();
  }
}

export async function installMissingDependency(depName, depVersions: MissingDependency) {
  const availableVersions = Object.keys(depVersions);
  let requestedVersion;

  if (availableVersions.length === 1) {
    const requirer = depVersions[availableVersions[0]];
    info(`Installing ${chalk.magenta(depName)}@${chalk.magenta(availableVersions[0])}, required by ${chalk.blue(requirer.name)}@${chalk.blue(requirer.version)}...`);
    requestedVersion = availableVersions[0];
  } else {
    info(`Installing ${chalk.magenta(depVersions[0].requiree.name)}, required by \n${versionsToString(depVersions)}`);
    requestedVersion = await question('Please enter the version you wish to install (empty for none):');
    if (!requestedVersion.trim()) {
      return;
    }
  }

  // https://github.com/npm/node-semver

  let useProd;
  do {
    const result = (await question(`Do you wish to mark this dependency as ${chalk.magenta('dev')} (0), ${chalk.magenta('prod')} (1, default), or skip (-1):\n`)) || '1';

    if (result === '0' || result === 'dev') {
      useProd = false;
    } else if (result === '1' || result === 'prod') {
      useProd = true;
    } else if (result === '-1') {
      return;
    } else {
      useProd = null;
    }
  } while (useProd === null);

  runCommandSync(`npm install ${depName}@${requestedVersion} ${useProd ? '--save' : '--save-dev'}`);
}

function versionsToString(depVersions: MissingDependency) {
  let str = '';

  for (const version of Object.keys(depVersions)) {
    const requirer = depVersions[version];
    str += `- ${chalk.magenta(version)}:\t ${chalk.blue(requirer.name)}@${chalk.blue(requirer.version)}\n`;
  }

  return str;
}
