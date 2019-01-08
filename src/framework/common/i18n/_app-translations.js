// @flow

import { loadMessageTranslationList } from '../../../shared/get-translations';
import { getDefault } from '../../../shared/util/ModuleUtil';
import { triggerI18nHotReload } from './_hot-reload';
import { getFileName, getLocaleBestFit, runBundleLoader } from './_locale-utils';

let messageTranslationsLoaders = loadMessageTranslationList();
let localeToFileMapping: Map<string, string> = buildMessagesLocaleList(messageTranslationsLoaders);

export type ReactIntlMessages = { [string]: string };

function buildMessagesLocaleList(loaders) {
  const mapping = new Map();
  loaders.keys().map(filePath => {
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

function formatTranslationMessages(messages): ReactIntlMessages {
  if (!Array.isArray(messages)) {
    return messages;
  }

  const formattedMessages = {};
  for (const message of messages) {
    formattedMessages[message.id] = message.message || message.defaultMessage;
  }

  return formattedMessages;
}

// TODO: move this global state to React Tree.

function installReactIntlMessagesForLocale(locale: string): Promise<ReactIntlMessages> {
  return downloadMessagesTranslationFile(locale)
    .then(translations => {
      if (translations == null || typeof translations !== 'object') {
        throw new TypeError(`Invalid translation file for locale ${JSON.stringify(locale)}, expected it to export an Object or an Array.`);
      }

      const messageTranslations = formatTranslationMessages(translations);
      Object.freeze(messageTranslations);

      return messageTranslations;
    });
}

function downloadMessagesTranslationFile(localeName: string): Promise<any> {

  return Promise.resolve().then(() => {
    // if we're trying to load en-US but we only have en, using en is fine.
    const actualLocale = getMessageLocaleBestFit(localeName);

    if (actualLocale == null) {
      throw new Error(`Unknown locale ${JSON.stringify(localeName)}. Did you forget to add the translation file ?`);
    }

    const file = localeToFileMapping.get(actualLocale);
    if (file == null) {
      throw new Error('ReworkJs: Internal Error while loading locale');
    }

    const loader = messageTranslationsLoaders(file);

    return runBundleLoader(loader)
      .then(module => getDefault(module));
  });
}

function getMessageLocaleBestFit(localeName: string) {
  return getLocaleBestFit(localeName, [...localeToFileMapping.keys()]);
}

/**
 * Checks if a given locale has matching translations in this app.
 * (eg. Is this app available in dutch?)
 *
 * @param localeName The locale for which we wish to know if the translation exists.
 * @returns Whether the translation is available.
 */
function isTranslationSupported(localeName: string): boolean {
  return getMessageLocaleBestFit(localeName) !== null;
}

export {
  installReactIntlMessagesForLocale,
  isTranslationSupported,
};

// HOT RELOAD INDIVIDUAL TRANSLATION FILES

// $FlowIgnore
if (module.hot) {
  module.hot.accept(messageTranslationsLoaders.id, () => {
    messageTranslationsLoaders = loadMessageTranslationList();
    localeToFileMapping = buildMessagesLocaleList(messageTranslationsLoaders);

    triggerI18nHotReload();
  });
}
