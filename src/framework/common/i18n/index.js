// @flow

/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 */

import { installReactIntlMessagesForLocale, isTranslationSupported, type ReactIntlMessages } from './_app-translations';
import { installIntlLocale } from './_native-intl';

/*
 * What needs to be available:
 * - Know if a given locale is supported (non-strict) = isTranslationSupported
 * - Install a locale (load polyfills & return translations)
 *
 * - Install a locale:
 *  - Determine best-fit for Intl locale data and Download polyfill (if required)
 *  - Determine best-fit for react-intl locale data and Download polyfill
 *  - Determine best-fit for react-intl messages and Download translation files
 */

// Listener boilerplate

// getter & setters

// TODO(DEFAULT_LOCALE): use default locale instead of 'en'
// TODO: move this global state to React Tree.

function installLocale(newLocale: string): Promise<{ messages: ReactIntlMessages, locale: string }> {

  return Promise.resolve().then(() => {

    if (!isTranslationSupported(newLocale)) {
      throw new Error(`Locale ${newLocale} is not supported (translation file missing).`);
    }

    return Promise.all([
      installReactIntlMessagesForLocale(newLocale),
      installIntlLocale(newLocale),
    ]).then(([translations]) => {
      return { messages: translations, locale: newLocale };
    });
  });
}

export {
  installLocale,
};

export { isTranslationSupported } from './_app-translations';
export { onIntlHotReload, offIntlHotReload } from './_hot-reload';
