// @flow

import { hasNativeIntl } from '../intl-polyfil';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

// TODO: memoize availableIntlLocales but only on server and in prod? It will be generated on every call.
function getIntlLocaleLoaders() {
  // $FlowIgnore
  return require.context('bundle-loader?lazy&name=IntlLocale-[name]!intl/locale-data/jsonp', true, /\.js$/);
}

export function installIntlLocale(localeName: string): Promise<void> {
  return Promise.resolve().then(() => {
    if (hasNativeIntl()) {
      return null;
    }

    // Note: this should never be called on non-webpack generated builds
    const intlLocaleLoaders = getIntlLocaleLoaders();
    const availableIntlLocales: string[] = intlLocaleLoaders.keys().map(getFileName);

    let actualLocale = getLocaleBestFit(localeName, availableIntlLocales);
    if (actualLocale == null) {
      console.error(`Could not fetch React-Intl locale ${localeName}, it does not exist (fallback to english).`);

      // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
      actualLocale = 'en';
    }

    const loader = intlLocaleLoaders(`./${actualLocale}.js`);

    return runBundleLoader(loader);
  }).then(() => {});
}
