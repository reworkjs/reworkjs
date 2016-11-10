/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 */
import { addLocaleData } from 'react-intl';
import { locales, loadLocale as importLocale, bestGuessTranslationLocale as bestGuessLocale } from './locales';

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

export const appLocales = locales;

const translations = {};
export function installLocale(localeName) {
  return importLocale(localeName)
    .then(locale => {
      if (locale.translations == null || typeof locale.translations !== 'object') {
        throw new TypeError(`Invalid translation file for locale ${JSON.stringify(localeName)}, expected it to export an Object or an Array.`);
      }

      addLocaleData(locale.intl);
      translations[locale.name] = formatTranslationMessages(locale.translations);
    });
}

export default translations;

export function isLocaleValid(locale) {
  return bestGuessLocale(locale) !== null;
}
