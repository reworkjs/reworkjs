import fs from 'fs';
import merge from 'lodash/merge';
import logger from '../../shared/logger';
import { FrameworkConfigStruct } from '../../shared/FrameworkConfigStruct';
import { resolveProject, requireRawProject, resolveFramework } from '../util/RequireUtil';
import defaultConfig from './default-config';

/**
 * Loads the .framework-config file and returns the config merged with defaults.
 */
function getUserConfig() {
  try {
    const appConfig = JSON.parse(requireRawProject('.framework-config'));

    logger.info('".framework-config" found in app directory, overriding defaults.');
    return appConfig;
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    logger.info('No ".framework-config" found in app directory, using defaults.');
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
        console.warn(`Invalid property for config key ${JSON.stringify(key)}`);
    }
  }

  return obj;
}

function checkDirectories(config: FrameworkConfigStruct) {
  for (const directoryName of Object.getOwnPropertyNames(config.directories)) {
    const directory = config.directories[directoryName];

    try {
      const stat = fs.statSync(directory);
      if (!stat.isDirectory()) {
        console.error(`directories.${directoryName} value ${JSON.stringify(directory)} is not a valid directory`);
        config.directories[directoryName] = resolveFramework('dummy/empty-directory');
      }
    } catch (e) {
      console.warn(`directories.${directoryName} value ${JSON.stringify(directory)} does not exist.`);
      config.directories[directoryName] = resolveFramework('dummy/empty-directory');
    }
  }

  return config;
}

const config: FrameworkConfigStruct = merge(defaultConfig, resolveEntries(getUserConfig()));

checkDirectories(config);

export default config;
