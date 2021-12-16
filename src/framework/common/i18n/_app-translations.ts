import { loadMessageTranslationList } from '@reworkjs/core/_internal_/translations';
import type { BundleLoader } from '@reworkjs/core/_internal_/translations';
import isPojo from '../../../shared/util/is-pojo.js';
import { getDefault } from '../../../shared/util/module-util.js';
import { triggerI18nHotReload } from './_hot-reload.js';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils.js';

let messageTranslationsLoaders = loadMessageTranslationList();
let localeToFileMapping: Map<string, string> = buildMessagesLocaleList(messageTranslationsLoaders);

export type ReactIntlMessages = { [key: string]: string };

function buildMessagesLocaleList(loaders: BundleLoader) {
  const mapping = new Map();
  loaders.keys().map((filePath: string) => {
    const locale = getFileName(filePath);

    // if there is a fr.js and fr.json file, throw.
    if (mapping.has(locale)) {
      throw new Error(`Duplicate translation file for locale ${JSON.stringify(locale)}`);
    }

    mapping.set(locale, filePath);

    return locale;
  });

  return mapping;
}

async function installReactIntlMessagesForLocale(locale: string): Promise<ReactIntlMessages> {
  return downloadMessagesTranslationFile(locale)
    .then(translations => {
      if (!isPojo(translations)) {
        throw new TypeError(`Invalid translation file for locale ${JSON.stringify(locale)}, expected it to export an plain object of [message id] => [translated message].`);
      }

      Object.freeze(translations);

      return translations;
    });
}

async function downloadMessagesTranslationFile(localeName: string): Promise<any> {

  return Promise.resolve().then(async () => {
    // if we're trying to load en-US but we only have en, using en is fine.
    const actualLocale = getMessageLocaleBestFit(localeName);

    if (actualLocale == null) {
      throw new Error(`Unknown locale ${JSON.stringify(localeName)}. Did you forget to add the translation file ?`);
    }

    const file = localeToFileMapping.get(actualLocale);
    if (file == null) {
      throw new Error('rework.js: Internal Error while loading locale');
    }

    const loader = messageTranslationsLoaders(file);

    return runBundleLoader(loader)
      .then(module => getDefault(module));
  });
}

function getMessageLocaleBestFit(localeName: string) {
  return getLocaleBestFit(localeName, Array.from(localeToFileMapping.keys()));
}

/**
 * Checks if a given locale has matching translations in this app.
 * (eg. Is this app available in dutch?)
 *
 * @param localeName The locale for which we wish to know if the translation exists.
 * @returns Whether the translation is available.
 */
function isTranslationSupported(localeName: string): boolean {
  return getMessageLocaleBestFit(localeName) != null;
}

export {
  installReactIntlMessagesForLocale,
  isTranslationSupported,
};

// HOT RELOAD INDIVIDUAL TRANSLATION FILES

// @ts-expect-error
if (typeof module !== 'undefined' && import.meta.webpackHot) {
  // @ts-expect-error
  import.meta.webpackHot
    .accept(messageTranslationsLoaders.id, () => {
      messageTranslationsLoaders = loadMessageTranslationList();
      localeToFileMapping = buildMessagesLocaleList(messageTranslationsLoaders);

      triggerI18nHotReload();
    });
}
