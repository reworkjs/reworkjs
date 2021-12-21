import config from '@reworkjs/core/_internal_/framework-config';
import recursiveReadSync from 'recursive-readdir-sync';

export function loadMessageTranslationList() {
  return requireContext(config.directories.translations, true, /\.js(on|x|m)$/);
}

export function getListFormatLoaders() {
  return requireContext('@formatjs/intl-listformat/locale-data', true, /\.js$/);
}

export function getNumberLocaleLoaders() {
  return requireContext('@formatjs/intl-numberformat/locale-data', true, /\.js$/);
}

export function getPluralRulesLocaleLoaders() {
  return requireContext('@formatjs/intl-pluralrules/locale-data', true, /\.js$/);
}

export function getRelativeTimeLocaleLoaders() {
  return requireContext('@formatjs/intl-relativetimeformat/locale-data', true, /\.js$/);
}

export interface RequireContextOut {
  (file: string): any; // the module
  keys(): string[];
  id: string;
}

function requireContext(path: string, _recursive: boolean, filter: RegExp): RequireContextOut {
  const files = recursiveReadSync(path)
    .filter((file: string) => filter.test(file))
    // replace absolute path with relative path to match webpack behavior
    // and replace windows \ path delimiter with UNIX & web style
    .map((file: string) => `.${file.substring(path.length)}`.replace(/\\/g, '/'));

  // mock bundle-loader:
  const bundle = function getLoader(fileName: string): any {
    console.warn(`Loading file using bundle loader mock is not supported (trying to load ${fileName}).`);

    return null;
  };

  bundle.id = path;

  bundle.keys = function keys() {
    return files;
  };

  return bundle;
}

export const DEFAULT_LOCALE = config.defaultLocale;

