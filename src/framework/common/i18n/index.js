// @flow

/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 */

import { installReactIntlMessagesForLocale, isTranslationSupported } from './_app-translations';
import { installIntlLocale } from './_native-intl';
import { installReactIntlLocale } from './_react-intl-locales';

/*
 * What needs to be available:
 * - Know if a given locale is supported (non-strict) = isTranslationSupported
 * - Set a given locale as the active locale (throws if unsupported)
 * - Get current active locale ("en" by default)
 * - add/remove active locale change listener
 *
 * - On Locale change:
 *  - Determine best-fit for Intl locale data and Download polyfill (if required)
 *  - Determine best-fit for react-intl locale data and Download polyfill
 *  - Determine best-fit for react-intl messages and Download translation files
 */

// Listener boilerplate

type ActiveLocaleChangeListener = (newLocale: string, oldLocale: string) => void;
const activeLocaleChangeListeners: Set<ActiveLocaleChangeListener> = new Set();

function onActiveLocaleChange(callback: ActiveLocaleChangeListener): void {
  activeLocaleChangeListeners.add(callback);
}

function offActiveLocaleChange(callback: ActiveLocaleChangeListener): boolean {
  return activeLocaleChangeListeners.delete(callback);
}

// getter & setters

let activeLocale = 'en';

function getActiveLocale() {
  return activeLocale;
}

function setActiveLocale(newLocale: string): Promise<void> {

  return Promise.resolve().then(() => {

    if (!isTranslationSupported(newLocale)) {
      throw new Error(`Locale ${newLocale} is not supported (translation file missing).`);
    }

    const oldLocale = activeLocale;
    activeLocale = newLocale;

    return Promise.all([
      installReactIntlMessagesForLocale(newLocale),
      installReactIntlLocale(newLocale),
      installIntlLocale(newLocale),
    ]).then(() => {
      activeLocaleChangeListeners.forEach(callback => {
        callback(newLocale, oldLocale);
      });
    });
  });
}

export {
  getActiveLocale,
  setActiveLocale,
  onActiveLocaleChange,
  offActiveLocaleChange,
};

export { getReactIntlMessages, isTranslationSupported } from './_app-translations';
export { onIntlHotReload, offIntlHotReload } from './_hot-reload';
