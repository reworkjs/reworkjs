// @flow
import fs from 'fs';
import mkdirp from 'mkdirp';
import webpack from 'webpack';
import chalk from 'chalk';
import logger from './logger';
import frameworkConfig from './framework-config';

export default function compileWebpack(config: Object, watch: boolean, callback: ?(entryPoint: StatDetails) => void) {
  const compiler = webpack(config);
  const compile = watch
    ? cb => compiler.watch({}, cb)
    : cb => compiler.run(cb);

  try {
    compile((err: Error, stats: Stats) => {

      if (err) {
        logger.error('Fatal error when building.');
        logger.error(err);
        throw err;
      }

      logger.debug(stats.toString());

      if (hasErrors(stats) || hasWarnings(stats)) {
        printErrors(stats);
        writeDebug(stats);
      } else {
        deleteDebug();
      }

      if (!hasErrors(stats)) {
        logger.info('Build complete.');

        if (callback) {
          callback(stats.toJson());
        }
      }
    });
  } catch (e) {
    logger.error('Fatal error when building.');
    logger.error(e);
    throw e;
  }
}

function hasErrors(stats: Stats) {
  if (stats.hasErrors) {
    return stats.hasErrors();
  }

  if (stats.errors) {
    return stats.errors.length > 0;
  }

  throw new TypeError('can\'t define if webpack compilation ouput has errors');
}

function hasWarnings(stats: Stats) {
  if (stats.hasWarnings) {
    return stats.hasWarnings();
  }

  if (stats.warnings) {
    return stats.warnings.length > 0;
  }

  throw new TypeError('can\'t define if webpack compilation ouput has warnings');
}

function printErrors(stats: Stats) {
  const jsonStats = stats.toJson();

  // parseWebpackStats(stats);

  if (hasWarnings(stats)) {
    logger.warn(`${jsonStats.warnings.length} warnings occurred when building.`);
  }

  if (hasErrors(stats)) {
    logger.error(`${jsonStats.errors.length} errors occurred when building.`);
  }

  for (const error of jsonStats.errors) {
    logger.error(`${error}\n`);
  }

  for (const warning of jsonStats.warnings) {
    logger.warn(`${warning}\n`);
  }
}

const DEBUG_LOCATION = `${frameworkConfig.directories.build}/webpack-debug.log`;
function writeDebug(stats) {
  logger.warn(`Debug log outputed at ${chalk.green(DEBUG_LOCATION)}`);
  mkdirp.sync(frameworkConfig.directories.build);
  fs.writeFileSync(DEBUG_LOCATION, stats.toString());
}

function deleteDebug() {
  try {
    fs.unlinkSync(DEBUG_LOCATION);
  } catch (e) {
    // ignore file not found.
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

// Bare minimum, there is more than that (see webpack docs).
export type Stats = {
  hasErrors: () => boolean,
  hasWarnings: () => boolean,
  toJson: () => StatDetails,
  toString: () => string,
};

export type StatDetails = {
  errors: string[],
  warnings: string[],
  entrypoints: { [key: string]: EntryPoint },
};

export type EntryPoint = {
  chunks: number[],
  assets: string[],
};
