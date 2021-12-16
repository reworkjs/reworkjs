import config from '@reworkjs/core/_internal_/framework-config';
import recursiveReadSync from 'recursive-readdir-sync';

export function loadMessageTranslationList() {
  return requireContext(config.directories.translations, true, /\.js(on|x|m)$/);
}

export type BundleModuleLoader = (callback: ((data: any) => any)) => void;
export interface BundleLoader {
  (file: string): BundleModuleLoader;
  keys(): string[];
  id: string;
}

function requireContext(path: string, _recursive: boolean, filter: RegExp): BundleLoader {
  const files = recursiveReadSync(path)
    .filter((file: string) => filter.test(file))
    // replace absolute path with relative path to match webpack behavior
    // and replace windows \ path delimiter with UNIX & web style
    .map((file: string) => `.${file.substr(path.length)}`.replace(/\\/g, '/'));

  // mock bundle-loader:
  const bundle = function getLoader(fileName: string): BundleModuleLoader {
    return function bundleModuleLoader(callback) {
      console.warn(`Loading file using bundle loader mock is not supported (trying to load ${fileName}).`);
      callback(null);
    };
  };

  bundle.id = path;

  bundle.keys = function keys() {
    return files;
  };

  return bundle;
}
