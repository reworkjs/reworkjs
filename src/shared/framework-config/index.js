import fs from 'fs';
import mkdirp from 'mkdirp';
import { merge } from 'lodash';
import { resolveProject } from '../../shared/resolve';
import logger from '../../shared/logger';
import { FrameworkConfigStruct } from '../../shared/FrameworkConfigStruct';
import { requireRawProject } from '../../internals/util/RequireUtil';
import defaultConfig from './default-config';

/**
 * Loads the .framework-config file and returns the config merged with defaults.
 */
function getUserConfig() {
  try {
    return JSON.parse(requireRawProject('.framework-config'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    logger.debug('No ".framework-config" found in app directory, using defaults.');
    return {};
  }
}

function resolveEntries(obj) {
  for (const key of Object.getOwnPropertyNames(obj)) {
    const val = obj[key];

    switch (typeof val) {
      case 'string':
        obj[key] = resolveProject(val);
        break;

      case 'object':
        if (val === null) {
          delete obj[key];
        }

        resolveEntries(val);
        break;

      default:
        logger.warn(`Invalid property for config key ${JSON.stringify(key)}`);
    }
  }

  return obj;
}

function checkDirectories(config: FrameworkConfigStruct) {
  for (const directoryName of Object.getOwnPropertyNames(config.directories)) {
    const directory = config.directories[directoryName];

    if (!isDirectory(directory)) {
      logger.debug(`framework configuration: directories.${directoryName} value ${JSON.stringify(directory)} is not a directory. Creating it.`);
      mkdirp(config.directories[directoryName]);
    }
  }

  return config;
}

function isDirectory(dir) {
  try {
    const stat = fs.statSync(dir);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

const config: FrameworkConfigStruct = merge(defaultConfig, resolveEntries(getUserConfig()));

if (config.directories.logs === null) {
  config.directories.logs = config.directories.build;
}

checkDirectories(config);

export default config;
