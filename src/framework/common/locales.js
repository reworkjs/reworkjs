import { getDefault } from '../../shared/util/ModuleUtil';
// import logger from '../../shared/logger';
const logger = console;

// const localeLoader = require.context('react-intl/locale-data', true, /\.js$/);

// WEBPACK
const translationLoaders = require.context('bundle-loader!@@directories.translations', true, /\.js$/);
const localeDataLoaders = require.context('bundle-loader!react-intl/locale-data', true, /\.js$/);

const availableIntls = localeDataLoaders.keys().map(getFileName);

const localeToFileMapping = new Map();
export const locales = translationLoaders.keys().map(filePath => {
  const locale = getFileName(filePath);

  if (localeToFileMapping.has(locale)) {
    throw new Error(`Duplicate translation file for locale ${JSON.stringify(locale)}`);
  }

  localeToFileMapping.set(locale, filePath);

  return locale;
});

export function loadLocale(locale) {
  const file = localeToFileMapping.get(locale);
  if (!file) {
    return Promise.reject(new Error(`Unknown locale ${JSON.stringify(locale)}. Did you forget to add the translation file ?`));
  }

  const translationPromise = new Promise(resolve => {
    const loader = translationLoaders(file);

    loader(module => resolve(getDefault(module)));
  });

  const intlPromise = new Promise(resolve => {
    const localeToUse = bestGuessIntl(locale);
    const loader = localeDataLoaders(`./${localeToUse}.js`);

    loader(module => resolve(getDefault(module)));
  });

  return Promise.all([translationPromise, intlPromise]).then(([translations, intl]) => {
    return {
      translations,
      intl,
      name: locale,
    };
  });
}

function bestGuessIntl(locale) {
  if (availableIntls.includes(locale)) {
    return locale;
  }

  const nextLocale = locale.indexOf('-') !== -1 ? locale.split('-')[0] : 'en';

  logger.warn(`Unknown locale "${locale}". Fallbacking to "${nextLocale}"`);
  return bestGuessIntl(nextLocale);
}

function getFileName(file) {
  return file.match(/^\.\/(.+)\..+$/)[1];
}
