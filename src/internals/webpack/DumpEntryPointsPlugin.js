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

      const moduleToChunk = makeModuleToChunkMapping(stats);
      const chunkFileNames = extractChunkFileNames(stats);

      const json = JSON.stringify({
        entryPoints,
        moduleToChunk,
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

function extractChunkFileNames(stats) {
  const chunkFileNames = {};
  for (const chunk of stats.chunks) {
    chunkFileNames[chunk.id] = chunk.files[0];
  }

  return chunkFileNames;
}

// TODO named chunks mapping
function makeModuleToChunkMapping(stats) {
  const modules = stats.modules;

  const moduleToChunk = {};
  const assignedChunks = [];

  let unprocessedModules = Object.keys(modules);
  let nextUnprocessedModules;
  let newFoundChunks;
  do {
    newFoundChunks = 0;
    nextUnprocessedModules = [];

    for (let i = 0; i < unprocessedModules.length; i++) {
      const module = modules[unprocessedModules[i]];
      module.chunks = module.chunks.filter(chunkId => !assignedChunks.includes(chunkId));

      if (module.chunks.length === 0) {
        continue;
      }

      if (module.chunks.length === 1) {
        moduleToChunk[module.id] = module.chunks[0];
        assignedChunks.push(module.chunks[0]);
        newFoundChunks++;
      } else {
        nextUnprocessedModules.push(i);
      }
    }

    unprocessedModules = nextUnprocessedModules;
  } while (newFoundChunks > 0);

  return moduleToChunk;
}
