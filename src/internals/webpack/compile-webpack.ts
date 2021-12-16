import fs from 'fs';
import frameworkConfig from '@reworkjs/core/_internal_/framework-config';
import logger from '@reworkjs/core/logger';
import webpack from 'webpack';
import type { Stats, StatsCompilation } from 'webpack';
import { chalkUrl } from '../../shared/chalk.js';

interface CallbackFunction<T> {
  (err?: Error, result?: T): any;
}

export default function compileWebpack(config: Object, watch: boolean, callback?: (entryPoint: StatsCompilation) => void) {
  const compiler = webpack(config);
  const compile = watch
    ? (cb: CallbackFunction<Stats>) => compiler.watch({}, cb)
    : (cb: CallbackFunction<Stats>) => compiler.run(cb);

  try {
    compile((err: Error, stats: Stats) => {

      if (err) {
        logger.error('Fatal error when building.');
        logger.error(err);
        throw err;
      }

      logger.trace(stats.toString());

      if (stats.hasErrors() || stats.hasWarnings()) {
        printErrors(stats);
        writeDebug(stats);
      } else {
        deleteDebug();
      }

      if (!stats.hasErrors()) {
        logger.info('Build complete.');

        if (callback) {
          callback(stats.toJson());
        }
      }

      if (stats.hasErrors() && !watch) {
        process.exit(1);
      }
    });
  } catch (e) {
    logger.error('Fatal error when building.');
    logger.error(e);
    throw e;
  }
}

function printErrors(stats: Stats) {
  const jsonStats = stats.toJson();

  // parseWebpackStats(stats);

  if (jsonStats.warnings) {
    logger.warn(`${jsonStats.warnings.length} warnings occurred when building.`);

    for (const warning of jsonStats.warnings) {
      logger.warn(`${warning.message}\n`);
    }
  }

  if (jsonStats.errors) {
    logger.error(`${jsonStats.errors.length} errors occurred when building.`);

    for (const error of jsonStats.errors) {
      logger.error(`${error.message}\n`);
    }
  }
}

const DEBUG_LOCATION = `${frameworkConfig.directories.build}/webpack-debug.log`;

function writeDebug(stats: Stats) {
  logger.warn(`Debug log outputed at ${chalkUrl(DEBUG_LOCATION)}`);
  fs.mkdirSync(frameworkConfig.directories.build, { recursive: true });
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
