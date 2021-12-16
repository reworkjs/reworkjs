import fs from 'fs/promises';
import logger from '@reworkjs/core/logger';
import fsExtra from 'fs-extra';
import inquirer from 'inquirer';
import semver from 'semver';
import type Yargs from 'yargs';
import { chalkCommand, chalkNok, chalkNpmDep, chalkOk } from '../../../shared/chalk.js';
import type { MaybePromise } from '../../../shared/util/typing.js';
import { execSync } from '../../util/process-util.js';
import { resolveProject, resolveRoot } from '../../util/resolve-util.js';

// TODO: handle NPM install crashes if module not found
// TODO: while running, print that the task is running
// TODO init git if package.json contains a repo ?
// TODO: Hide NPM's STDOUT if verbosity isn't debug.

export default function registerCommand(cli: Yargs.Argv) {

  cli
    .command(
      'init',
      'Setups your project',
      yargs => {
        return yargs.option('no-interactive', {
          alias: 'y',
          type: 'boolean',
          describe: 'Disables prompting. Default values will be used.',
        });
      },
      async argv => {
        await runInitScripts(argv.noInteractive as boolean);

        logger.info('');
        logger.info(`All done! Run '${chalkCommand('npm run start:dev')}' to launch your project`);
      },
    );
}

type TScript = {
  isReady?(): MaybePromise<boolean>,
  run(noInteractive: boolean): any,
};

const scripts: { [key: string]: TScript } = {
  'Install peer dependencies': {
    isReady() {
      return false;
    },

    async run() {
      const { peerDependencies } = await fsExtra.readJson(resolveRoot('package.json'));
      const projectPkg = await fsExtra.readJson(resolveProject('package.json'));

      const installed = projectPkg.dependencies || {};

      const toInstall = [];
      for (const depName of Object.keys(peerDependencies)) {
        const depVersionRange = peerDependencies[depName];
        const version = installed[depName];
        const cleanVersion = version ? semver.clean(version) : null;

        if (!cleanVersion || !semver.satisfies(cleanVersion, depVersionRange)) {
          toInstall.push(`${depName}@${depVersionRange}`);
        }
      }

      if (toInstall.length > 0) {
        logger.info(`Installing peer dependencies ${toInstall.map(dep => chalkNpmDep(dep)).join(', ')}`);
        execSync(`npm install --save ${toInstall.join(' ')}`);
      }
    },
  },

  'Add npm scripts': {
    async isReady() {
      const projectPkg = await fsExtra.readJson(resolveProject('package.json'));

      if (projectPkg.scripts) {
        return false;
      }

      if (!projectPkg.scripts.build && projectPkg.scripts['start:dev']) {
        return false;
      }

      if (!projectPkg.devDependencies['check-engines']) {
        return false;
      }

      return true;
    },

    async run() {
      const pkgPath = resolveProject('package.json');

      const projectPkg = await fsExtra.readJson(pkgPath);

      projectPkg.scripts = projectPkg.scripts || {};
      const pkgScripts = projectPkg.scripts;

      pkgScripts['start:dev'] = pkgScripts['start:dev'] || 'check-engines && NODE_ENV=development rjs start --port 3000';
      pkgScripts.build = pkgScripts.build || 'NODE_ENV=production rjs build client server';

      await fsExtra.writeJson(pkgPath, projectPkg);
      execSync(`npm install --save-dev check-engines`);
    },
  },

  'Install .gitignore': {

    /**
     * Check that the project contains a .gitignore file.
     * @async
     * @returns {!boolean}
     */
    async isReady() {
      return fsExtra.pathExists(resolveProject('.gitignore'));
    },

    async run() {
      return fsExtra.copy(
        resolveRoot('resources/.gitignore.raw'),
        resolveProject('.gitignore'),
      );
    },
  },

  'Install .browserslistrc': {

    /**
     * Check that the project contains a .browserslistrc file.
     * @async
     * @returns {!boolean}
     */
    async isReady() {
      return fsExtra.pathExists(resolveProject('.browserslistrc'));
    },

    async run() {
      return fsExtra.copy(
        resolveRoot('resources/.browserslistrc.raw'),
        resolveProject('.browserslistrc'),
      );
    },
  },

  'Install eslint': {

    /**
     * Check that the project contains a .eslintrc file.
     * @async
     * @returns {!boolean}
     */
    async isReady() {
      return fsExtra.pathExists(resolveProject('.eslintrc'));
    },

    async run(noInteractive: boolean) {
      if (noInteractive) {
        return;
      }

      const { preset } = await inquirer.prompt([{
        type: 'input',
        message: 'What ESLint preset do you want to use ? (blank for none).',
        name: 'preset',
        default() {
          return '';
        },
      }]);

      if (!preset) {
        return;
      }

      execSync(`npm install --save-dev eslint ${preset}`);

      await fs.writeFile(
        resolveProject('.eslintrc'),
        `{
  "extends": "${preset}"
}`,
      );
    },
  },

  'Install stylelint': {

    /**
     * Check that the project contains a .stylelintrc file.
     * @async
     * @returns {!boolean}
     */
    async isReady() {
      return fsExtra.pathExists(resolveProject('.stylelintrc'));
    },

    async run(noInteractive: boolean) {
      if (noInteractive) {
        return;
      }

      const { preset } = await inquirer.prompt([{
        type: 'input',
        message: 'What Stylelint preset do you want to use ? (blank for none).',
        name: 'preset',
        default() {
          return '';
        },
      }]);

      if (!preset) {
        return;
      }

      execSync(`npm install --save-dev stylelint ${preset}`);

      await fs.writeFile(
        resolveProject('.stylelintrc'),
        `{
  "extends": "${preset}"
}`,
      );
    },
  },

  'Init git': {
    async isReady() {
      return fsExtra.pathExists(resolveProject('.git'));
    },
    async run(noInteractive: boolean) {
      let defaultBranch = 'main';

      if (!noInteractive) {
        const { branch } = await inquirer.prompt([{
          type: 'input',
          message: 'Name of your default git branch',
          name: 'branch',
          default() {
            return 'main';
          },
        }]);

        defaultBranch = branch;
      }

      execSync(`git init --initial-branch=${defaultBranch}`);
    },
  },

  'Install lint-staged': {
    async isReady() {

      const pck = await fsExtra.readJson(resolveProject('package.json'));

      // pre-commit disabled
      if (pck['pre-commit'] === false) {
        return true;
      }

      if (!pck.devDependencies['lint-staged']) {
        return false;
      }

      return pck.devDependencies.husky !== void 0;
    },

    async run() {
      execSync('npm install --save-dev husky lint-staged');
      execSync('npx husky install');

      logger.info(`Consider adding ${chalkCommand(`"prepare": "husky install"`)} to package.json [https://typicode.github.io/husky/#/?id=install]`);

      // lint-staged config
      const lintStagedRc = resolveProject('.lintstagedrc');
      if (!await fsExtra.pathExists(lintStagedRc)) {
        await fsExtra.copy(
          resolveRoot('resources/.lintstagedrc.raw'),
          lintStagedRc,
        );
      }

      const huskyDestination = resolveProject('.husky');
      if (!await fsExtra.pathExists(huskyDestination)) {
        await fsExtra.copy(
          resolveRoot('resources/.husky'),
          huskyDestination,
        );
      }
    },
  },

  'Configure PostCss': {
    async isReady() {
      return fsExtra.pathExists(resolveProject('postcss.config.js'));
    },

    async run() {
      execSync('npm install --save-dev @reworkjs/postcss-preset-reworkjs');

      await fsExtra.copy(
        resolveRoot('resources/postcss.config.js.raw'),
        resolveProject('postcss.config.js'),
      );
    },
  },
};

async function runInitScripts(noInteractive: boolean) {
  for (const scriptName of Object.keys(scripts)) {
    // run sequentially, don't Promise.all this.
    // eslint-disable-next-line no-await-in-loop
    await runScript(scriptName, scripts[scriptName], noInteractive);
  }
}

async function runScript(scriptName: string, script: TScript, noInteractive: boolean) {
  try {
    if (typeof script.isReady === 'function') {
      const isReady = await script.isReady();
      if (typeof isReady !== 'boolean') {
        logger.info(`${chalkNok('✘')} ${scriptName} - Script has a bug.`);

        return;
      }

      if (isReady) {
        logger.info(`${chalkOk('✓')} ${scriptName}`);

        return;
      }
    }

    await script.run(noInteractive);

    logger.info(`${chalkOk('✓')} ${scriptName}`);
  } catch (e) {
    logger.info(`${chalkNok('✘')} ${scriptName} - Script crashed.`);
    throw e;
  }
}
