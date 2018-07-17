// @flow

import { addLocaleData } from 'react-intl';
import { loadReactIntlLocaleList } from '../../../shared/get-translations';
import { getDefault } from '../../../shared/util/ModuleUtil';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

const reactIntlLocaleLoaders = loadReactIntlLocaleList();
const availableReactIntlLocales: string[] = reactIntlLocaleLoaders.keys().map(getFileName);

function installReactIntlLocale(localeName: string): Promise<void> {
  return Promise.resolve().then(() => {
    let actualLocale = getIntlLocaleBestFit(localeName);
    if (actualLocale == null) {
      console.error(`Could not fetch React-Intl locale ${localeName}, it does not exist (fallback to english).`);
      actualLocale = 'en';
    }

    const loader = reactIntlLocaleLoaders(`./${actualLocale}.js`);

    return runBundleLoader(loader).then(module => {
      const localeData = getDefault(module);

      addLocaleData(localeData);
    });
  });
}

function getIntlLocaleBestFit(locale: string): ?string {
  return getLocaleBestFit(locale, availableReactIntlLocales);
}

export {
  installReactIntlLocale,
};
