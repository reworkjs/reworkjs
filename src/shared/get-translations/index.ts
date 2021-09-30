import recursiveReadSync from 'recursive-readdir-sync';
import config from '../framework-config';

export function loadMessageTranslationList() {
  return requireContext(config.directories.translations, true, /\.js(on|x|m)$/);
}

type BundleModuleLoader = (callback: ((any) => any)) => void;
type BundleLoader = (file: string) => BundleModuleLoader;

function requireContext(path: string, _recursive: boolean, filter: RegExp): BundleLoader {
  const files = recursiveReadSync(path)
    .filter(file => filter.test(file))
    // replace absolute path with relative path to match webpack behavior
    // and replace windows \ path delimiter with UNIX & web style
    .map(file => `.${file.substr(path.length)}`.replace(/\\/g, '/'));

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
