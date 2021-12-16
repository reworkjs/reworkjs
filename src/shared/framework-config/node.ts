/**
 * @module framework-config
 *
 * Version for internal tools (cli, builders).
 *
 * DO NOT use in client or server bundle.
 */

import fs from 'fs';
import path from 'path';
import logger from '@reworkjs/core/logger';
import Joi from 'joi';
import get from 'lodash/get.js';
import set from 'lodash/set.js';
import argv from '../../internals/rjs-argv.js';
import { resolveProject } from '../../internals/util/resolve-util.js';

const isCustomConfigFile = Boolean(argv.reworkrc);
const frameworkConfigFile = (argv.reworkrc && path.resolve(argv.reworkrc)) || resolveProject('.reworkrc');

export type FrameworkPluginConfig = {
  plugin: string,
  config: any,
};

export type FrameworkConfigStruct = {

  routingType: 'browser' | 'hash',

  directories: {
    logs: string,
    build: string,
    resources: string,
    translations: string,
  },

  routes: string,
  'entry-react': string | null,
  'render-html': string | null,
  'pre-init': string | null,
  'service-worker': string | null,
  'emit-integrity': boolean,

  hooks: {
    client: string | null,
    server: string | null,
  },
  plugins: { [key: string]: any },

  filePath: string,
};

/**
 * Loads the .framework-config file and returns the config merged with defaults.
 */
function getUserConfig() {

  if (!fs.existsSync(frameworkConfigFile)) {

    if (isCustomConfigFile) {
      logger.warn(`Configuration File ${frameworkConfigFile} does not exist`);
    }

    return {};
  }

  return JSON.parse(fs.readFileSync(frameworkConfigFile).toString());
}

function normalizeConfig(config: Object) {
  const schema = Joi.object().keys({
    routingType: Joi.string().valid('browser', 'hash').default('browser'),
    routes: Joi.string().default('src/**/*.route.{js,jsx,ts,tsx,mjs}'),
    'entry-react': Joi.string().allow(null).default(null),
    'render-html': Joi.string().allow(null).default(null),
    'pre-init': Joi.string().allow(null).default(null),
    'service-worker': Joi.string().allow(null).default(null),
    'emit-integrity': Joi.boolean().default(true),

    directories: Joi.object().keys({
      logs: Joi.alternatives().try(
        Joi.string().default('./.build'),

        // disable log
        Joi.boolean().valid(false),
      ),
      build: Joi.string().default('./.build'),
      resources: Joi.string().default('./src/public'),
      translations: Joi.string().default('./src/translations'),
    }).default(),

    hooks: Joi.object({
      client: Joi.string().allow(null).default(null),
      server: Joi.string().allow(null).default(null),
    }).default(),
    plugins: Joi.object().unknown(true).default(),
  }).default();

  const normalizedConfig = Joi.attempt(config, schema, `${frameworkConfigFile} is invalid`);

  const fileEntries = [
    'entry-react',
    'render-html',
    'pre-init',
    'service-worker',
    'directories.logs',
    'directories.build',
    'directories.resources',
    'directories.translations',
  ];

  const configDir = path.dirname(frameworkConfigFile);
  for (const pathEntry of fileEntries) {
    const val = get(normalizedConfig, pathEntry);

    if (val == null) {
      continue;
    }

    set(normalizedConfig, pathEntry, path.resolve(configDir, val));
  }

  ensureDirectories(normalizedConfig);

  return normalizedConfig;
}

function ensureDirectories(config: FrameworkConfigStruct) {
  const keys = Object.keys(config.directories) as Array<keyof FrameworkConfigStruct['directories']>;
  for (const directoryName of keys) {
    const directory = config.directories[directoryName];

    if (!isDirectorySync(directory)) {
      logger.debug(`framework configuration: directories.${directoryName} value ${JSON.stringify(directory)} is not a directory. Creating it.`);
      fs.mkdirSync(config.directories[directoryName], { recursive: true });
    }
  }
}

function isDirectorySync(dir: string): boolean {
  try {
    const stat = fs.statSync(dir);

    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

const config: FrameworkConfigStruct = normalizeConfig(getUserConfig());

config.filePath = frameworkConfigFile;

export default config;
