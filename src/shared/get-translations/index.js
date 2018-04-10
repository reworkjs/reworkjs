// @flow

import libPath from 'path';
import config from '../framework-config';
import recursiveReadSync from 'recursive-readdir-sync';

export function loadTranslationList() {
  return requireContext(config.directories.translations, true, /\.js(on|x|m)$/);
}

export function loadLocaleList() {
  const directory = libPath.dirname(require.resolve('react-intl/locale-data'));

  return requireContext(directory, true, /\.js$/);
}

function requireContext(path: string, recursive: boolean, filter: RegExp) {
  const files = recursiveReadSync(path)
    .filter(file => filter.test(file))
    // replace absolute path with relative path to webpack behavior
    .map(file => `.${file.substr(path.length)}`);

  // mock bundle-loader:
  const bundle = function getLoader() {};

  bundle.keys = function keys() {
    return files;
  };

  return bundle;
}
