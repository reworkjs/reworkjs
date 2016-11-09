/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 */
import { addLocaleData } from 'react-intl';
import { locales, loadLocale as importLocale } from './locales';

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

installLocale('en');
