// @flow

import { shouldPolyfill as shouldPolyfillListFormat } from '@formatjs/intl-listformat/should-polyfill.js';
import { shouldPolyfill as shouldPolyfillNumber } from '@formatjs/intl-numberformat/should-polyfill.js';
import { shouldPolyfill as shouldPolyfillPlural } from '@formatjs/intl-pluralrules/should-polyfill.js';
import { shouldPolyfill as shouldPolyfillRelativeTime } from '@formatjs/intl-relativetimeformat/should-polyfill.js';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

function _loadPolyfillLocale(localeLoaders, localeName: string) {
  const availableIntlLocales: string[] = localeLoaders.keys().map(getFileName);
  let actualLocale = getLocaleBestFit(localeName, availableIntlLocales);

  if (actualLocale == null) {
    console.error(`Could not fetch Unified Number Format locale '${localeName}'. Fallback to 'en'.`);

    // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
    actualLocale = 'en';
  }

  const loader = localeLoaders(`./${actualLocale}.js`);

  return runBundleLoader(loader);
}

// ===================== LIST FORMAT  =====================

function getListFormatLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intllist-[name]!@formatjs/intl-listformat/locale-data', true, /\.js$/);
}

async function installListFormat(localeName: string) {
  if (!shouldPolyfillListFormat(localeName)) {
    return;
  }

  await import(/* webpackChunkName: "p-intllist" */ '@formatjs/intl-listformat/polyfill');
  await _loadPolyfillLocale(getListFormatLoaders(), localeName);
}

// ===================== NUMBER FORMAT  =====================

function getNumberLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intlunit-[name]!@formatjs/intl-numberformat/locale-data', true, /\.js$/);
}

async function installUnifiedNumberFormat(localeName: string) {
  // install polyfill if unified number format is not natively supported
  if (!shouldPolyfillNumber(localeName)) {
    return;
  }

  await import(/* webpackChunkName: "p-intlunit" */'@formatjs/intl-numberformat/polyfill');
  await _loadPolyfillLocale(getNumberLocaleLoaders(), localeName);
}

// ===================== PLURAL RULES  =====================

function getPluralRulesLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intlplural-[name]!@formatjs/intl-pluralrules/locale-data', true, /\.js$/);
}

async function installPluralRules(localeName: string) {
  if (!shouldPolyfillPlural(localeName)) {
    return;
  }

  await import(/* webpackChunkName: "p-intlplural" */ '@formatjs/intl-pluralrules/polyfill');
  await _loadPolyfillLocale(getPluralRulesLocaleLoaders(), localeName);
}

// ===================== RELATIVE TIME =====================

function getRelativeTimeLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=p-intlrelative-[name]!@formatjs/intl-relativetimeformat/locale-data', true, /\.js$/);
}

async function installRelativeTime(localeName: string) {
  if (!shouldPolyfillRelativeTime(localeName)) {
    return;
  }

  await _loadPolyfillLocale(getRelativeTimeLocaleLoaders(), localeName);
}

// ====================================================================

export function installIntlLocale(localeName: string): Promise<void> {

  return Promise.all([
    installUnifiedNumberFormat(localeName),
    installPluralRules(localeName),
    installRelativeTime(localeName),
    installListFormat(localeName),
  ]).then(() => void 0);
}
