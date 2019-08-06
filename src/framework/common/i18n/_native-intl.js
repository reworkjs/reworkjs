// @flow

import global from 'global';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

// Node should always have these available, no need for polyfilling

function getNumberDateTimeLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intl-[name]!intl/locale-data/jsonp', true, /\.js$/);
}

function getRelativeTimeLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intlrelative-[name]!@formatjs/intl-relativetimeformat/dist/locale-data', true, /\.js$/);
}

function areNumberAndDateTimeSupported(locale: string): boolean {
  const Intl = global.Intl;

  if (!Intl) {
    return false;
  }

  if (!Intl.DateTimeFormat
    || !Intl.NumberFormat
    || !Intl.DateTimeFormat.supportedLocalesOf
    || !Intl.NumberFormat.supportedLocalesOf) {
    return false;
  }

  if (Intl.DateTimeFormat.supportedLocalesOf([locale]).length === 0) {
    return false;
  }

  if (Intl.NumberFormat.supportedLocalesOf([locale]).length === 0) {
    return false;
  }

  return true;
}

function downloadNumberAndDateTime() {
  return import(/* webpackChunkName: "p-intl" */ 'intl');
}

function installNumberAndDateTime(localeName: string) {
  // load base DateTimeFormat / NumberFormat
  const intlPromise = global.Intl ? Promise.resolve() : downloadNumberAndDateTime();

  // load locale data
  return intlPromise.then(() => {
    if (areNumberAndDateTimeSupported(localeName)) {
      return null;
    }

    // load locale best fit
    // Note: this should never be called on non-webpack generated builds
    const intlLocaleLoaders = getNumberDateTimeLocaleLoaders();
    const availableIntlLocales: string[] = intlLocaleLoaders.keys().map(getFileName);

    let actualLocale = getLocaleBestFit(localeName, availableIntlLocales);
    if (actualLocale == null) {
      console.error(`Could not fetch Intl locale '${localeName}'. Fallback to 'en'.`);

      // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
      actualLocale = 'en';
    }

    const loader = intlLocaleLoaders(`./${actualLocale}.js`);

    return runBundleLoader(loader);
  });
}

function installPluralRules(localeName: string) {
  const Intl = global.Intl;

  if (Intl
    && Intl.PluralRules
    && Intl.PluralRules.supportedLocalesOf
    && Intl.PluralRules.supportedLocalesOf(localeName).length !== 0) {
    return Promise.resolve();
  }

  return import(/* webpackChunkName: "p-intlplural" */ 'intl-pluralrules');
}

function installRelativeTime(localeName: string) {
  const Intl = global.Intl;

  if (Intl
    && Intl.RelativeTimeFormat
    && Intl.RelativeTimeFormat.supportedLocalesOf
    && Intl.RelativeTimeFormat.supportedLocalesOf(localeName).length !== 0) {
    return Promise.resolve();
  }

  return import(/* webpackChunkName: "p-intlrelative" */ '@formatjs/intl-relativetimeformat/polyfill').then(() => {

    // load locale best fit
    // Note: this should never be called on non-webpack generated builds
    const localeLoaders = getRelativeTimeLocaleLoaders();
    const availableLocales: string[] = localeLoaders.keys().map(getFileName);

    let actualLocale = getLocaleBestFit(localeName, availableLocales);
    if (actualLocale == null) {
      console.error(`Could not fetch Intl.RelativeTimeFormat locale '${localeName}'. Fallback to 'en'.`);

      // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
      actualLocale = 'en';
    }

    const loader = localeLoaders(`./${actualLocale}.js`);

    return runBundleLoader(loader);
  });
}

export function installIntlLocale(localeName: string): Promise<void> {

  return Promise.all([
    installNumberAndDateTime(localeName),
    installPluralRules(localeName),
    installRelativeTime(localeName),
  ]).then(() => void 0);
}
