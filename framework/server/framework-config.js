import merge from 'lodash/merge';
import { resolveProject, requireRawProject } from '../util/RequireUtil';
import defaultConfig from '../../lib/default-config.json';

export type Plugin = string | [string, any];

export type frameworkConfigStruct = {
  directories: {
    build: string,
    resources: string,
    routes: string,
    providers: ?string,
    translations: string,
  },

  'entry-react': string,
  'entry-html': string,
  'pre-init': ?string,

  babel: ?Plugin[],
  postCss: ?Plugin[],
};

/**
 * Loads the .framework-config file and returns the config merged with defaults.
 */
function mergeConfig() {
  try {
    const appConfig = JSON.parse(requireRawProject('.framework-config'));

    console.info('".framework-config" found in app directory, overriding defaults...');
    return merge(defaultConfig, appConfig);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    console.info('No ".framework-config" found in app directory, using defaults...');
    return defaultConfig;
  }
}

const config: frameworkConfigStruct = mergeConfig();

for (const key of Object.getOwnPropertyNames(config.directories)) {
  config.directories[key] = resolveProject(config.directories[key]);
}

if (config['pre-init']) {
  config['pre-init'] = resolveProject(config['pre-init']);
}

if (config.webpack) {
  config.webpack = resolveProject(config.webpack);
}

config['entry-html'] = resolveProject(config['entry-html']);

export default config;
