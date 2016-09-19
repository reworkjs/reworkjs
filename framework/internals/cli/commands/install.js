import fs from 'fs';
import { resolveProject } from '../../../util/RequireUtil';
import { runCommandSync } from '../run-command';
import { checkDependencies, installMissingDependency } from '../npm';
import { info, warn } from '../stdio';

const packageJsonLoc = resolveProject('package.json');

export default async function install() {
  initNpm();

  await installPeerDeps();
}

function initNpm() {
  if (isFileSync(packageJsonLoc)) {
    return;
  }

  info('No package.json, running npm init...');
  runCommandSync('npm init');

  // TODO how to detect that the previous process was killed ?
  if (!isFileSync(packageJsonLoc)) {
    process.exit(1);
  }
}

async function installPeerDeps() {
  info('Checking dependencies...');
  const dependencies = checkDependencies();

  if (dependencies.extraneous.length > 0) {
    warn(`You have ${dependencies.extraneous.length} extraneous dependencies, you might want to consider running \`npm prune\``);
  }

  if (dependencies.missing.length > 0) {
    console.warn(`You have ${dependencies.missing.length} missing dependencies.`);

    for (const dependency of dependencies.missing) {
      await installMissingDependency(dependency);
    }
  }
}

function isFileSync(file) {
  try {
    const stat = fs.lstatSync(file);

    return stat.isFile();
  } catch (e) {
    return false;
  }
}
