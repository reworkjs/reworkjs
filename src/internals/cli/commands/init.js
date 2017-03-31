import chalk from 'chalk';
import { resolveProject } from '../../../shared/resolve';
import logger from '../../../shared/logger';
import { existsAsync } from '../../util/fs-util';

export default function registerCommand(commander) {

  commander
    .command('init')
    .description('Setups your project')
    .action(() => {
      runInitScripts();
    });
}

const scripts = {
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

    },
  },

  'Install eslint': {
    isReady() {
      // check there is a .eslintrc
    },

    run() {
      // - Prompt for eslint-config package      + default | skipable
      // - Install eslint
      // - Install preset
      // - write .eslintrc
    },
  },

  'Install stylelint': {
    isReady() {
      // check there is a .stylelintrc
    },

    run() {
      /*
       - Prompt for stylelint-config package   + default | skipable
       - Install stylelint
       - Install preset
       - print .stylelintrc
       */
    },
  },

  'Install stage-lint': {
    isReady() {
    },

    run() {
      /*
       - Add stage-lint
       */
    },
  },

  'Configure PostCss': {
    isReady() {
      // check there is a postcss config
    },

    run() {
      /*
       - Add default postcss.config.js
       */
    },
  },

  'Add README': {
    isReady() {
      // check there is a README file
    },

    run() {
      /*
       - Add README.md
       */
    },
  },

  'Install dependencies': {
    isReady() {
      // check all dependencies are in package.json
    },

    run() {
      /*
       - Install Dependencies
       - `react`
       - `react-dom`
       - `react-helmet`
       - `react-cookie`
       - `react-router-redux`
       - `redux-saga`
       - `react-intl`
       - Install devDependencies
       - `@reworkjs/babel-preset-reworkjs`
       */
    },
  },
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
   - run scripts
   - print "Project ready, use `rjs start --env dev` to launch your project. Read more at <getting started doc url>"
   */
}

async function runScript(scriptName, script) {
  if (await script.isReady()) {
    logger.info(`${chalk.green('✓')} ${scriptName}`);
    return;
  }

  try {
    await script.run();
  } catch (e) {
    logger.info(`${chalk.red('✘')} ${scriptName} - Script crashed.`);
    throw e;
  }

  if (await script.isReady()) {
    logger.info(`${chalk.green('✓')} ${scriptName}`);
  } else {
    logger.info(`${chalk.red('✘')} ${scriptName} - Script has a bug.`);
  }
}
