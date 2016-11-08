import fs from 'fs';
import mkdirp from 'mkdirp';
import webpack from 'webpack';
import chalk from 'chalk';
import logger from '../../shared/logger';
import frameworkConfig from '../config/framework-config';

export default function compileWebpack(config, watch: boolean, callback: ?(entryPoint: StatDetails) => void) {
  const compiler = webpack(config);

  const compile = watch
    ? cb => compiler.watch({}, cb)
    : cb => compiler.compile(cb);

  compile((err: Error, stats: Stats) => {
    if (err) {
      logger.error('Fatal error when building.');
      logger.error(err);
      throw err;
    }

    if (stats.hasErrors() || stats.hasWarnings()) {
      printErrors(stats);
      writeDebug(stats);
    } else {
      deleteDebug();
    }

    if (!stats.hasErrors()) {
      logger.info('Build complete.');
      callback(stats.toJson());
    }
  });
}

function printErrors(stats: Stats) {
  const jsonStats = stats.toJson();

  if (stats.hasWarnings()) {
    logger.warn(`${jsonStats.warnings.length} warnings occurred when building.`);
  }

  if (stats.hasErrors()) {
    logger.error(`${jsonStats.errors.length} errors occurred when building.`);
  }

  let i = 0;
  for (; i < 15 && i < jsonStats.errors.length; i++) {
    logger.error(`${jsonStats.errors[i]}\n`);
  }

  for (let j = 0; i < 15 && j < jsonStats.warnings.length; i++, j++) {
    logger.warn(`${jsonStats.warnings[j]}\n`);
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
