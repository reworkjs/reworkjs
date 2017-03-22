import fs from 'fs';
import { partition } from 'lodash';

export default class DumpEntryPoints {

  apply(compiler) {
    const fileName = `${compiler.options.output.path}-entrypoints.json`;

    compiler.plugin('emit', (compilation, callback) => {
      const stats = compilation.getStats().toJson();

      const entryPoints = getEntryPoints(stats);
      if (entryPoints.js.length === 0) {
        return callback();
      }

      const entryPointsJson = JSON.stringify(entryPoints);
      fs.writeFile(fileName, entryPointsJson, callback);
    });
  }
}

function getEntryPoints(stats) {
  const mainAssets = stats.entrypoints.main.assets.filter(fileName => {
    return !fileName.endsWith('.hot-update.js');
  });

  const splitAssets = partition(mainAssets, asset => asset.endsWith('.js'));

  return {
    js: splitAssets[0],
    css: splitAssets[1],
  };
}
