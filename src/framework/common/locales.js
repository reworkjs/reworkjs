import { getDefault } from '../../shared/util/ModuleUtil';
// import logger from '../../shared/logger';
const logger = console;

// TODO support for .json locales.
// TODO use actual logger.

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

  const translationPromise = new Promise((resolve, reject) => {
    const translationLocale = bestGuessTranslationLocale(locale);

    if (translationLocale === null) {
      return reject(new Error(`Unknown locale ${JSON.stringify(locale)}. Did you forget to add the translation file ?`));
    }

    const file = localeToFileMapping.get(translationLocale);
    const loader = translationLoaders(file);

    loader(module => resolve(getDefault(module)));
  });

  const intlPromise = new Promise(resolve => {
    const intlLocale = bestGuessIntlLocale(locale);
    const loader = localeDataLoaders(`./${intlLocale}.js`);

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

export function bestGuessTranslationLocale(locale) {
  if (localeToFileMapping.has(locale)) {
    return locale;
  }

  if (locale.indexOf('-') === -1) {
    return null;
  }

  const countryPart = locale.split('-')[0];
  if (localeToFileMapping.has(countryPart)) {
    return countryPart;
  }

  return null;
}

function bestGuessIntlLocale(locale) {
  if (availableIntls.includes(locale)) {
    return locale;
  }

  const nextLocale = locale.indexOf('-') !== -1 ? locale.split('-')[0] : 'en';

  logger.warn(`Unknown locale "${locale}". Fallbacking to "${nextLocale}"`);
  return bestGuessIntlLocale(nextLocale);
}

function getFileName(file) {
  return file.match(/^\.\/(.+)\..+$/)[1];
}
