import { dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Class } from 'type-fest';
import { importAll } from '../util/require-util.js';
import type BaseFeature from './BaseFeature.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const modules = await importAll(`${__dirname}/features/**/*.js`);

const featureClasses: Array<Class<BaseFeature>> = Array.from(modules.values())
  .map(module => module.default);

Object.freeze(featureClasses);

export default featureClasses;
