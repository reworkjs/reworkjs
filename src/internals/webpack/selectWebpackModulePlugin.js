import fs from 'fs';
import path from 'path';
// import logger from '../../shared/logger';

// const MATCH_FILE = /([^!]+)$/;

/**
 * Replace a module with its webpack version if its structure is as follows:
 *
 * /module-directory
 *  /index.js
 *  /webpack.js
 *
 * import module from './moduleDirectory';
 *
 * @returns {webpack.NormalModuleReplacementPlugin}
 */
export default function selectWebpackModulePlugin(onReplacing) {

  return new SelectWebpackModulePlugin(onReplacing);
}

class SelectWebpackModulePlugin {
  cache: Map<string, ?string> = new Map();

  constructor(onReplacing) {
    this.onReplacing = onReplacing;
  }

  apply(compiler) {
    compiler.plugin('normal-module-factory', nmf => {
      // nmf.plugin('before-resolve', (result, callback) => {
      //   if (!result) {
      //     return callback();
      //   }
      //
      //   this.replaceRequest(result);
      //   callback(null, result);
      // });

      nmf.plugin('after-resolve', (result, callback) => {
        if (!result) {
          return callback();
        }

        this.replaceResource(result);

        return callback(null, result);
      });
    });
  }

  replaceResource(result) {
    const file = result.resource;
    const webpackVersion = this.getWebpackVersion(file);
    if (webpackVersion == null) {
      return;
    }

    result.resource = webpackVersion;
    // logger.debug('selectWebpackModulePlugin:\n\treplacing\t', file, '\n\twith\t\t', webpackVersion);
  }

  // replaceRequest(result) {
  //
  //   const pathMatch = result.request.match(MATCH_FILE);
  //
  //   if (pathMatch == null) {
  //     return;
  //   }
  //
  //   const file = path.resolve(result.context, pathMatch[1]);
  //
  //   const webpackVersion = this.getWebpackVersion(file);
  //   if (webpackVersion == null) {
  //     return;
  //   }
  //
  //   const cancelReplace = this.onReplacing ? this.onReplacing(file, webpackVersion) === false : false;
  //   if (cancelReplace) {
  //     return;
  //   }
  //
  //   result.request = result.request.replace(MATCH_FILE, webpackVersion);
  //
  //   logger.debug('selectWebpackModulePlugin:\n\treplacing\t', file, '\n\twith\t\t', webpackVersion);
  // }

  getWebpackVersion(file) {
    const cache = this.cache;
    if (cache.has(file)) {
      return cache.get(file);
    }

    const webpackVersion = findWebpackVersion(file);
    cache.set(file, webpackVersion);

    return webpackVersion;
  }
}

function findWebpackVersion(file) {
  const fileInfo = fs.statSync(file);

  let directory;
  if (fileInfo.isFile()) {
    const { name } = path.parse(file);
    if (name !== 'index') {
      return null;
    }

    directory = path.dirname(file);
  } else if (fileInfo.isDirectory()) {
    directory = file;
  } else {
    return null;
  }

  const webpackVersion = path.join(directory, 'webpack.js');

  try {
    const fileStat = fs.statSync(webpackVersion);
    return fileStat.isFile() ? webpackVersion : null;
  } catch (e) {
    return null;
  }
}

// function stat(file) {
//   return new Promise((resolve, reject) => {
//     fs.stat(file, (error, result) => {
//       if (error) {
//         return reject(error);
//       }
//
//       return resolve(result);
//     });
//   });
// }
