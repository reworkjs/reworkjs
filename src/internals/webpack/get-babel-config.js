import chalk from 'chalk';
import findBabelConfig from 'find-babel-config';
import logger from '../../shared/logger';
import { resolveProject } from '../../shared/resolve';

export default function getBabelConfig() {
  // FIXME note: might break with Babel 7 due to new support for babelrc.js
  const { config } = findBabelConfig.sync(resolveProject('.'));

  if (config == null) {
    return getDefaultBabelConfig();
  }

  // no need to load it, babel will do it on its own.
  return null;
}

function getDefaultBabelConfig() {

  try {
    return require('@reworkjs/babel-preset-reworkjs').default(); // eslint-disable-line
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }

    logger.error(`You need to have either ${chalk.magenta('@reworkjs/babel-preset-reworkjs')} installed or have a babel configuration file available at the root of your project.`);
    throw e;
  }
}
