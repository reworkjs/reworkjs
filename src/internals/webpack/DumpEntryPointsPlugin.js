import fs from 'fs';
import { partition } from 'lodash';

export default class DumpEntryPoints {

  apply(compiler) {
    const fileName = `${compiler.options.output.path}-entrypoints.json`;

    compiler.plugin('emit', (compilation, callback) => {
      const stats = compilation.getStats().toJson();

      const entryPoints = getEntryPoints(stats);
      if (entryPoints.js.length === 0) {
        return void callback();
      }

      const { chunkNames, chunkFileNames } = extractChunkMeta(stats);

      const json = JSON.stringify({
        entryPoints,
        chunkNames,
        chunkFileNames,
      });

      fs.writeFile(fileName, json, callback);
    });
  }
}

function getEntryPoints(stats) {
  const mainAssets = stats.entrypoints.main.assets.filter(fileName => {
    if (!fileName.endsWith('.js') && !fileName.endsWith('.css')) {
      return false;
    }

    return !fileName.endsWith('.hot-update.js');
  });

  const splitAssets = partition(mainAssets, asset => asset.endsWith('.js'));

  return {
    js: splitAssets[0],
    css: splitAssets[1],
  };
}

function extractChunkMeta(stats) {
  const chunkFileNames = {};
  const chunkNames = {};
  for (const chunk of stats.chunks) {
    if (chunk.names.length !== 1) {
      // DEOPTIMIZATION:
      // if a chunk is not named or has more than one name, we cannot
      // properly match it between client/server builds
      // so they are not pre-rendered.
      continue;
    }

    const chunkName = chunk.names[0];
    chunkNames[chunk.id] = chunkName;

    const files = chunk.files.filter(file => file.endsWith('.js') || file.endsWith('.css'));
    if (files.length === 0) {
      continue;
    }

    chunkFileNames[chunkName] = files;
  }

  return { chunkFileNames, chunkNames };
}
