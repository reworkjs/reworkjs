// @flow

import fs from 'mz/fs';
import fsExtra from 'fs-extra';
import noop from 'lodash/noop';
import inquirer from 'inquirer';
import semver from 'semver';
import { chalkCommand, chalkNok, chalkNpmDep, chalkOk } from '../../../shared/chalk';
import { resolveProject, resolveRoot } from '../../util/resolve-util';
import logger from '../../../shared/logger';
import { execSync } from '../../util/process-util';

// TODO: handle NPM install crashes if module not found
// TODO: while running, print that the task is running
// TODO init git if package.json contains a repo ?
// TODO: Hide NPM's STDOUT if verbosity isn't debug.

export default function registerCommand(commander) {

  commander
    .command('init', 'Setups your project', noop, async () => {
      await runInitScripts();

      logger.info();
      logger.info(`All done! Run '${chalkCommand('npm run start:dev')}' to launch your project`);
    });
}

const scripts = {
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

        if (!installed[depName] || !semver.satisfies(semver.clean(installed[depName]), depVersionRange)) {
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
    isReady() {
      return fs.exists(resolveProject('.gitignore'));
    },

    run() {
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
    isReady() {
      return fs.exists(resolveProject('.browserslistrc'));
    },

    run() {
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
    isReady() {
      return fs.exists(resolveProject('.eslintrc'));
    },

    async run() {
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
    isReady() {
      return fs.exists(resolveProject('.stylelintrc'));
    },

    async run() {
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

      // lint-staged config
      const lintStagedRc = resolveProject('.lintstagedrc');
      if (!await fs.exists(lintStagedRc)) {
        await fsExtra.copy(
          resolveRoot('resources/.lintstagedrc.raw'),
          lintStagedRc,
        );
      }

      const huskyJson = resolveProject('.huskyrc.json');
      if (!await fs.exists(huskyJson)) {
        await fsExtra.copy(
          resolveRoot('resources/.huskyrc.json.raw'),
          huskyJson,
        );
      }
    },
  },

  'Configure PostCss': {
    isReady() {
      return fs.exists(resolveProject('postcss.config.js'));
    },

    async run() {
      execSync('npm install --save-dev @reworkjs/postcss-preset-reworkjs');

      await fsExtra.copy(
        resolveRoot('resources/postcss.config.js.raw'),
        resolveProject('postcss.config.js'),
      );
    },
  },

  // 'Add README': {
  //   isReady() {
  //     // check there is a README file
  //   },
  //
  //   run() {
  //     /*
  //      - Add README.md
  //      */
  //   },
  // },
};

async function runInitScripts() {

  for (const scriptName of Object.keys(scripts)) {
    // run sequentially, don't Promise.all this.
    // eslint-disable-next-line no-await-in-loop
    await runScript(scriptName, scripts[scriptName]);
  }

  /*
   - print "Project ready, use `rjs start --env dev` to launch your project. Read more at <getting started doc url>"
   */
}

async function runScript(scriptName, script) {
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

    await script.run();

    logger.info(`${chalkOk('✓')} ${scriptName}`);
  } catch (e) {
    logger.info(`${chalkNok('✘')} ${scriptName} - Script crashed.`);
    throw e;
  }
}
