import merge from 'lodash/merge';
import escapeRegExp from 'escape-string-regexp';
import pushAll from '../../shared/util/push-all';

const FILE_TYPE_JS = Symbol('FILE_TYPE_JS');
const FILE_TYPE_CSS = Symbol('FILE_TYPE_JS');
const FILE_TYPE_IMG = Symbol('FILE_TYPE_IMG');

type WcbState = {
  fileTypes: { [key: Symbol]: string[] },
  rawConfig: Object,
  rules: Array,
  cssLoaders: Array,
  plugins: Array,
  aliases: { [Key: string]: string[] },
};

// FIXME https://github.com/gajus/eslint-plugin-flowtype/issues/213
// eslint-disable-next-line no-use-before-define
const stateHolder: WeakMap<WebpackConfigBuilder, WcbState> = new WeakMap();

function getState(instance): WcbState {
  return stateHolder.get(instance);
}

export default class WebpackConfigBuilder {

  static FILE_TYPE_JS = FILE_TYPE_JS;
  static FILE_TYPE_CSS = FILE_TYPE_CSS;
  static FILE_TYPE_IMG = FILE_TYPE_IMG;

  constructor() {
    const state: WcbState = {
      fileTypes: {
        [FILE_TYPE_JS]: ['js', 'jsx', 'mjs', 'ts', 'tsx'],
        [FILE_TYPE_CSS]: ['css'],
        [FILE_TYPE_IMG]: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      },
      rawConfig: {},
      rules: [],
      cssLoaders: [],
      plugins: [],
      aliases: {},
    };

    stateHolder.set(this, state);
  }

  registerFileType(type, extension) {
    pushAll(getState(this).fileTypes[type], extension);
  }

  injectCssLoader(loader) {
    // loader execution order is last to first.
    getState(this).cssLoaders.unshift(loader);
  }

  injectRawConfig(config) {
    merge(getState(this).rawConfig, config);
  }

  injectPlugins(plugins) {
    pushAll(getState(this).plugins, plugins);
  }

  injectRules(rule) {
    pushAll(getState(this).rules, rule);
  }

  injectAlias(original, alias) {
    getState(this).aliases[original] = alias;
  }
}

export function getAliases(instance) {
  return getState(instance).aliases;
}

export function getPlugins(instance) {
  return getState(instance).plugins;
}

export function mergeRaw(instance, obj) {
  return merge(obj, getState(instance).rawConfig);
}

export function buildRules(instance) {
  const state = getState(instance);

  return state.rules.map(_obj => {
    const obj = Object.assign({}, _obj);

    // map the file type symbols to their respective regexp.
    // this allows adding extensions for some files after the rules was added.
    obj.test = getFileTypeRegExp(instance, obj.test);

    return obj;
  });
}

export function getCssLoaders(instance) {
  return getState(instance).cssLoaders;
}

export function getFileTypeExtensions(instance, fileType) {
  const state = getState(instance);
  if (!state.fileTypes[fileType]) {
    throw new TypeError('Invalid filetype');
  }

  return state.fileTypes[fileType];
}

export function getFileTypeRegExp(instance, fileType) {
  if (fileType instanceof RegExp) {
    return fileType;
  }

  return toRegExp(getFileTypeExtensions(instance, fileType));
}

function toRegExp(fileExt: Array) {
  return new RegExp(`\\.(${fileExt.map(escapeRegExp).join('|')})$`, 'i');
}
