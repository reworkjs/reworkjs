// @flow

import libPath from 'path';
import config from '../framework-config';
import recursiveReadSync from 'recursive-readdir-sync';

export function loadMessageTranslationList() {
  return requireContext(config.directories.translations, true, /\.js(on|x|m)$/);
}

export function loadReactIntlLocaleList() {
  const directory = libPath.dirname(require.resolve('react-intl/locale-data'));

  return requireContext(directory, true, /\.js$/);
}

type BundleModuleLoader = (callback: (any) => any) => void;
type BundleLoader = (file: string) => BundleModuleLoader;

function requireContext(path: string, recursive: boolean, filter: RegExp): BundleLoader {
  const files = recursiveReadSync(path)
    .filter(file => filter.test(file))
    // replace absolute path with relative path to webpack behavior
    .map(file => `.${file.substr(path.length)}`);

  // mock bundle-loader:
  const bundle = function getLoader(fileName: string) {
    return function bundleModuleLoader(callback) {
      console.warn(`Loading file using bundle loader mock is not supported (trying to load ${fileName}).`);
      callback(null);
    };
  };

  bundle.keys = function keys() {
    return files;
  };

  return bundle;
}
