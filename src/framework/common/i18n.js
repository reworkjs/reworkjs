/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 */
import { addLocaleData } from 'react-intl';
import { locales, loadLocale as importLocale, bestGuessTranslationLocale as bestGuessLocale } from './locales';

function formatTranslationMessages(messages) {
  const formattedMessages = {};
  for (const message of messages) {
    formattedMessages[message.id] = message.message || message.defaultMessage;
  }

  return formattedMessages;
}

export const appLocales = locales;
const translations = {};
export function installLocale(localeName) {
  importLocale(localeName).then(locale => {
    addLocaleData(locale.intl);
    translations[locale.name] = formatTranslationMessages(locale.translations);
  });
}

export default translations;

export function isLocaleValid(locale) {
  return bestGuessLocale(locale) !== null;
}

export function tryInstall(locale) {
  locale = bestGuessLocale(locale);

  if (locale) {
    installLocale(locale);
    return true;
  }

  return false;
}
