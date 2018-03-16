/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 */
import { addLocaleData } from 'react-intl';
import { getDefault } from '../../shared/util/ModuleUtil';
import logger from '../../shared/logger';

// TODO load Intl Polyfill if required
// TODO make locales load any kind of JS file webpack would + json

// WEBPACK
let translationLoaders = require.context('bundle-loader?lazy&name=Translation-[name]!@@directories.translations', true, /\.js(on|x|m)$/);
const localeDataLoaders = require.context('bundle-loader?lazy&name=IntlLocale-[name]!react-intl/locale-data', true, /\.js$/);

const availableIntls = localeDataLoaders.keys().map(getFileName);

const localeToFileMapping = new Map();
export const locales = buildLocaleList();
function buildLocaleList() {
  localeToFileMapping.clear();
  translationLoaders.keys().map(filePath => {
    const locale = getFileName(filePath);

    if (localeToFileMapping.has(locale)) {
      throw new Error(`Duplicate translation file for locale ${JSON.stringify(locale)}`);
    }

    localeToFileMapping.set(locale, filePath);

    return locale;
  });
}

const loadedTranslationFiles = {};
const aliases = {};
function downloadLocale(requestedLocaleName) {

  const translationLocale = bestGuessTranslationLocale(requestedLocaleName);

  const translationPromise = new Promise((resolve, reject) => {

    if (translationLocale === null) {
      return void reject(new Error(`Unknown locale ${JSON.stringify(requestedLocaleName)}. Did you forget to add the translation file ?`));
    }

    const file = localeToFileMapping.get(translationLocale);
    const loader = translationLoaders(file);

    loadedTranslationFiles[file] = true;
    if (translationLocale !== requestedLocaleName) {
      aliases[requestedLocaleName] = translationLocale;
    }

    loader(module => resolve(getDefault(module)));
  });

  const intlPromise = new Promise(resolve => {
    const intlLocale = bestGuessIntlLocale(requestedLocaleName);
    const loader = localeDataLoaders(`./${intlLocale}.js`);

    loader(module => resolve(getDefault(module)));
  });

  return Promise.all([translationPromise, intlPromise]).then(([translations, intl]) => {
    return {
      translations,
      intl,
      translationLocale,
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

function formatTranslationMessages(messages) {
  if (!Array.isArray(messages)) {
    return messages;
  }

  const formattedMessages = {};
  for (const message of messages) {
    formattedMessages[message.id] = message.message || message.defaultMessage;
  }

  return formattedMessages;
}

const translations = {};
export default translations;

export function installLocale(requestedLocaleName) {
  return downloadLocale(requestedLocaleName)
    .then(locale => {
      if (locale.translations == null || typeof locale.translations !== 'object') {
        throw new TypeError(`Invalid translation file for locale ${JSON.stringify(requestedLocaleName)}, expected it to export an Object or an Array.`);
      }

      addLocaleData(locale.intl);

      const actualLocaleName = locale.translationLocale;
      translations[actualLocaleName] = formatTranslationMessages(locale.translations);

      refreshAliases(actualLocaleName);
    });
}

function refreshAliases(localeName) {

  for (const key of Object.keys(aliases)) {
    const value = aliases[key];
    if (value === localeName) {
      translations[key] = translations[localeName];
    }
  }
}

export function isLocaleValid(locale) {
  return typeof locale === 'string' && bestGuessTranslationLocale(locale) !== null;
}

const reloadListeners = [];
export function onHotReload(callback) {
  reloadListeners.push(callback);
}

// HOT RELOAD INDIVIDUAL TRANSLATION FILES
if (module.hot) {
  module.hot.accept(translationLoaders.id, () => {
    const reloadedTranslationLoaders = require.context('bundle-loader!@@directories.translations', true, /\.js$/);
    translationLoaders = reloadedTranslationLoaders;
    buildLocaleList();

    const reloadingFiles = reloadedTranslationLoaders.keys()
      .filter(file => loadedTranslationFiles[file] === true)
      .map(file => installLocale(getFileName(file)));

    Promise.all(reloadingFiles).then(() => {
      for (const listener of reloadListeners) {
        listener();
      }
    });
  });
}
