// @flow

import { hasNativeIntl } from '../intl-polyfil';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

// $FlowIgnore
const intlLocaleLoaders = require.context('bundle-loader?lazy&name=IntlLocale-[name]!intl/locale-data/jsonp', true, /\.js$/);
const availableIntlLocales: string[] = intlLocaleLoaders.keys().map(getFileName);

export function installIntlLocale(localeName: string): Promise<void> {
  return Promise.resolve().then(() => {
    if (hasNativeIntl()) {
      return null;
    }

    let actualLocale = getLocaleBestFit(localeName, availableIntlLocales);
    if (actualLocale == null) {
      console.error(`Could not fetch React-Intl locale ${localeName}, it does not exist (fallback to english).`);
      actualLocale = 'en';
    }

    const loader = intlLocaleLoaders(`./${actualLocale}.js`);

    return runBundleLoader(loader);
  }).then(() => {});
}
