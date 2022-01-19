import assert from 'assert';
import path from 'path';
import logger from '@reworkjs/core/logger';
import type { StatsCompilation, StatsChunkGroup } from 'webpack';
import { chalkUrl } from '../../shared/chalk.js';
import compileWebpack from '../webpack/compile-webpack.js';
import config from '../webpack/webpack.server.js';

logger.info('Building your server-side app, this might take a minute.');

const WATCH = process.env.WATCH === 'true';

compileWebpack(config, WATCH, (stats: StatsCompilation) => {
  const mainEntryPoint: StatsChunkGroup | undefined = stats.entrypoints?.main;
  assert(mainEntryPoint != null);

  const entryPoints = mainEntryPoint.assets?.filter(asset => {
    const fileName: string = asset.name;

    if (!fileName.endsWith('.js')) {
      return false;
    }

    // ignore hot updates for now
    return !fileName.endsWith('.hot-update.js');
  }) ?? [];

  if (entryPoints.length !== 1) {
    logger.debug('entry points:');
    logger.debug(entryPoints);
    throw new Error('Webpack built but the output does not have exactly one entry point. This is a bug.');
  }

  const entryPoint = path.join(config.output.path, entryPoints[0].name);

  // don't need to know about the entry point if it is handled by another process automatically.
  const method = process.send ? 'debug' : 'info';

  logger[method](`Server entry point: ${chalkUrl(entryPoint)}`);

  // tell manager CLI to launch server
  if (process.send) {
    process.send({
      cmd: 'built',
      exe: entryPoint,
    });
  }
});
