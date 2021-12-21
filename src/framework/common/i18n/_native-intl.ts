import { shouldPolyfill as shouldPolyfillListFormat } from '@formatjs/intl-listformat/should-polyfill.js';
import { shouldPolyfill as shouldPolyfillNumber } from '@formatjs/intl-numberformat/should-polyfill.js';
import { shouldPolyfill as shouldPolyfillPlural } from '@formatjs/intl-pluralrules/should-polyfill.js';
import { shouldPolyfill as shouldPolyfillRelativeTime } from '@formatjs/intl-relativetimeformat/should-polyfill.js';
import { getListFormatLoaders, getNumberLocaleLoaders, getPluralRulesLocaleLoaders, getRelativeTimeLocaleLoaders, DEFAULT_LOCALE } from '@reworkjs/core/_internal_/translations';
import { getFileName, getLocaleBestFit } from './_locale-utils.js';

async function _loadPolyfillLocale(localeLoaders, localeName: string) {
  const availableIntlLocales: string[] = localeLoaders.keys().map(getFileName);
  let actualLocale = getLocaleBestFit(localeName, availableIntlLocales);

  if (actualLocale == null) {
    actualLocale = availableIntlLocales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : 'en';

    console.error(`Could not fetch Unified Number Format locale '${localeName}'. Fallback to '${actualLocale}'.`);
  }

  const Module = await localeLoaders(`./${actualLocale}.js`);

  return Module.default;
}

// ===================== LIST FORMAT  =====================

async function installListFormat(localeName: string) {
  if (!shouldPolyfillListFormat(localeName)) {
    return;
  }

  await import(/* webpackChunkName: "p-intllist" */ '@formatjs/intl-listformat/polyfill.js');
  await _loadPolyfillLocale(getListFormatLoaders(), localeName);
}

// ===================== NUMBER FORMAT  =====================

async function installUnifiedNumberFormat(localeName: string) {
  // install polyfill if unified number format is not natively supported
  if (!shouldPolyfillNumber(localeName)) {
    return;
  }

  await import(/* webpackChunkName: "p-intlunit" */'@formatjs/intl-numberformat/polyfill.js');
  await _loadPolyfillLocale(getNumberLocaleLoaders(), localeName);
}

// ===================== PLURAL RULES  =====================

async function installPluralRules(localeName: string) {
  if (!shouldPolyfillPlural(localeName)) {
    return;
  }

  await import(/* webpackChunkName: "p-intlplural" */ '@formatjs/intl-pluralrules/polyfill.js');
  await _loadPolyfillLocale(getPluralRulesLocaleLoaders(), localeName);
}

// ===================== RELATIVE TIME =====================

async function installRelativeTime(localeName: string) {
  if (!shouldPolyfillRelativeTime(localeName)) {
    return;
  }

  await _loadPolyfillLocale(getRelativeTimeLocaleLoaders(), localeName);
}

// ====================================================================

export async function installIntlLocale(localeName: string): Promise<void> {

  return Promise.all([
    installUnifiedNumberFormat(localeName),
    installPluralRules(localeName),
    installRelativeTime(localeName),
    installListFormat(localeName),
  ]).then(() => void 0);
}
