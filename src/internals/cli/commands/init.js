import fs from 'mz/fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { resolveProject, resolveRoot } from '../../util/resolve-util';
import logger from '../../../shared/logger';
import { existsAsync } from '../../util/fs-util';
import { execSync } from '../../util/process-util';

// TODO: handle NPM install crashes if module not found
// TODO: while running, print that the task is running
// TODO init git if package.json contains a repo ?
// TODO: Hide NPM's STDOUT if verbosity isn't debug.

export default function registerCommand(commander) {

  commander
    .command('init')
    .description('Setups your project')
    .action(() => {
      runInitScripts();
    });
}

const scripts = {
  'Install peer dependencies': {
    isReady() {
      return false;
    },

    async run() {
      const { peerDependencies } = await fs.readJson(resolveRoot('package.json'));
      const projectPkg = await fs.readJson(resolveProject('package.json'));

      const installed = projectPkg.dependencies || {};

      const toInstall = [];
      for (const peerDep of Object.keys(peerDependencies)) {
        if (!installed[peerDep]) {
          toInstall.push(`${peerDep}@${peerDependencies[peerDep]}`);
        }
      }

      if (toInstall.length > 0) {
        logger.info(`Installing peer dependencies ${toInstall.map(dep => chalk.blue(dep)).join(', ')}`);
        execSync(`npm install --save ${toInstall.join(' ')}`);
      }
    },
  },

  'Install .gitignore': {

    /**
     * Check that the project contains a .gitignore file.
     * @async
     * @returns {!boolean}
     */
    isReady() {
      return existsAsync(resolveProject('.gitignore'));
    },

    run() {
      return fs.copy(
        resolveRoot('resources/.gitignore.raw'),
        resolveProject('.gitignore')
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
      return existsAsync(resolveProject('.browserslistrc'));
    },

    run() {
      return fs.copy(
        resolveRoot('resources/.browserslistrc.raw'),
        resolveProject('.browserslistrc')
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
      return existsAsync(resolveProject('.eslintrc'));
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

      return void fs.writeFile(
        resolveProject('.eslintrc'),
        `{
  "extends": "${preset}"
}`
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
      return existsAsync(resolveProject('.stylelintrc'));
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

      return void fs.writeFile(
        resolveProject('.stylelintrc'),
        `{
  "extends": "${preset}"
}`
      );
    },
  },

  'Install stage-lint': {
    async isReady() {

      const pck = await fs.readJson(resolveProject('package.json'));

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

      const pckFile = resolveProject('package.json');

      const pkg = await fs.readJson(pckFile);

      // NPM script to run
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.precommit = pkg.scripts.precommit || 'lint-staged';

      await fs.writeJson(pckFile, pkg);

      // lint-staged config
      if (!await existsAsync('.lintstagedrc')) {
        await fs.copy(
          resolveRoot('resources/.lintstagedrc.raw'),
          resolveProject('.lintstagedrc')
        );
      }
    },
  },

  'Configure PostCss': {
    isReady() {
      return existsAsync(resolveProject('postcss.config.js'));
    },

    run() {
      execSync('npm install --save-dev @reworkjs/postcss-preset-reworkjs');

      return fs.copy(
        resolveRoot('resources/postcss.config.js.raw'),
        resolveProject('postcss.config.js')
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

const emptyPromise = Promise.resolve();
function runInitScripts() {

  let promise = emptyPromise;
  for (const scriptName of Object.keys(scripts)) {
    // run sequentially, don't Promise.all this.
    promise = promise.then(() => {
      return runScript(scriptName, scripts[scriptName]);
    });
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
        logger.info(`${chalk.red('✘')} ${scriptName} - Script has a bug.`);
        return;
      }

      if (isReady) {
        logger.info(`${chalk.green('✓')} ${scriptName}`);
        return;
      }
    }

    await script.run();

    logger.info(`${chalk.green('✓')} ${scriptName}`);
  } catch (e) {
    logger.info(`${chalk.red('✘')} ${scriptName} - Script crashed.`);
    throw e;
  }
}
