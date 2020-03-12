// @flow

import globalThis from '../../../shared/globalThis';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

// TODO: listFormat

function getUnitLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intlunit-[name]!@formatjs/intl-unified-numberformat/dist/locale-data', true, /\.json$/);
}

function getRelativeTimeLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intlrelative-[name]!@formatjs/intl-relativetimeformat/dist/locale-data', true, /\.json$/);
}

function getListFormatLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intllist-[name]!@formatjs/intl-listformat/dist/locale-data', true, /\.js$/);
}

function isUnifiedNumberFormatSupported(locale: string): boolean {
  return globalThis.Intl.NumberFormat.supportedLocalesOf([locale]).length !== 0;
}

const hasNativeUnifiedNumberFormat: boolean = (() => {
  try {
    new globalThis.Intl.NumberFormat('en-US', { style: 'unit', unit: 'meter' }).format(0);

    return true;
  } catch (e) {
    return false;
  }
})();

async function installUnifiedNumberFormat(localeName: string) {
  // install polyfill if unified number format is not natively supported
  if (hasNativeUnifiedNumberFormat) {
    return;
  }

  await import(/* webpackChunkName: "p-intlunit" */'@formatjs/intl-unified-numberformat/polyfill');

  // load locale data
  if (isUnifiedNumberFormatSupported(localeName)) {
    return;
  }

  // load locale best fit
  // Note: this should never be called on non-webpack generated builds
  const intlLocaleLoaders = getUnitLocaleLoaders();
  const availableIntlLocales: string[] = intlLocaleLoaders.keys().map(getFileName);

  let actualLocale = getLocaleBestFit(localeName, availableIntlLocales);
  if (actualLocale == null) {
    console.error(`Could not fetch Unified Number Format locale '${localeName}'. Fallback to 'en'.`);

    // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
    actualLocale = 'en';
  }

  const loader = intlLocaleLoaders(`./${actualLocale}.json`);
  const localeModule = await runBundleLoader(loader);

  Intl.NumberFormat.__addLocaleData(localeModule);
}

async function installPluralRules(localeName: string) {
  const Intl = globalThis.Intl;

  if (Intl.PluralRules
    && Intl.PluralRules.supportedLocalesOf
    && Intl.PluralRules.supportedLocalesOf(localeName).length !== 0) {
    return;
  }

  // the overhead generated by the lazy-loader of each individual locale
  // is equivalent to the overhead of loading all locales
  // so might as well only impact people without the polyfill.
  await import(/* webpackChunkName: "p-intlplural" */ '@formatjs/intl-pluralrules/polyfill');
  await import(/* webpackChunkName: "p-intlplural" */ './_intl-plural-locales');
}

async function installRelativeTime(localeName: string) {
  const Intl = globalThis.Intl;

  if (Intl
    && Intl.RelativeTimeFormat
    && Intl.RelativeTimeFormat.supportedLocalesOf
    && Intl.RelativeTimeFormat.supportedLocalesOf(localeName).length !== 0) {
    return;
  }

  await import(/* webpackChunkName: "p-intlrelative" */ '@formatjs/intl-relativetimeformat/polyfill');

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

  const loader = localeLoaders(`./${actualLocale}.json`);

  const localeModule = await runBundleLoader(loader);
  Intl.RelativeTimeFormat.__addLocaleData(localeModule);
}

async function installListFormat(localeName: string) {
  const Intl = globalThis.Intl;

  if (Intl
    && Intl.ListFormat
    && Intl.ListFormat.supportedLocalesOf
    && Intl.ListFormat.supportedLocalesOf(localeName).length !== 0) {
    return;
  }

  await import(/* webpackChunkName: "p-intllist" */ '@formatjs/intl-listformat/polyfill');

  // load locale best fit
  // Note: this should never be called on non-webpack generated builds
  const localeLoaders = getListFormatLoaders();
  const availableLocales: string[] = localeLoaders.keys().map(getFileName);

  let actualLocale = getLocaleBestFit(localeName, availableLocales);
  if (actualLocale == null) {
    console.error(`Could not fetch Intl.ListFormat locale '${localeName}'. Fallback to 'en'.`);

    // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
    actualLocale = 'en';
  }

  const loader = localeLoaders(`./${actualLocale}.js`);

  // js version as json version is not supported
  await runBundleLoader(loader);
}

export function installIntlLocale(localeName: string): Promise<void> {

  return Promise.all([
    installUnifiedNumberFormat(localeName),
    installPluralRules(localeName),
    installRelativeTime(localeName),
    installListFormat(localeName),
  ]).then(() => void 0);
}
