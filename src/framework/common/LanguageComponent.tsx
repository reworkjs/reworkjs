import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { IntlProvider } from 'react-intl';
import { EMPTY_OBJECT } from '../util/utils.js';
import { ActiveLocaleContext } from './active-locale-context.js';
import { isTranslationSupported } from './i18n/_app-translations.js';
import type { ReactIntlMessages } from './i18n/_app-translations.js';
import { guessPreferredLocale, LOCALE_COOKIE_NAME } from './i18n/get-preferred-locale.js';
import {
  onIntlHotReload,
  installLocale,
} from './i18n/index.js';
import { useAcceptLanguage } from './ssr-browser-apis';

type Props = {
  children: ReactNode,
};

/**
 * this component synchronizes the internal i18n state with react-intl.
 */
export default function LanguageComponent(props: Props) {
  const acceptLanguages = useAcceptLanguage();
  const [cookies, setCookie] = useCookies([LOCALE_COOKIE_NAME]);
  const localeCookie = cookies[LOCALE_COOKIE_NAME];

  // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
  const [activeLocale, setActiveLocale] = useState<string>('en');
  const [messages, setMessages] = useState<ReactIntlMessages>(EMPTY_OBJECT);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const initialLocale = guessPreferredLocale(localeCookie, acceptLanguages);

    // TODO: warn on error?
    void installLocale(initialLocale).then(data => {
      setActiveLocale(initialLocale);
      setMessages(data.messages);
    });
    // we only want to run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // @ts-expect-error Webpack internal
    if (import.meta.webpackHot) {
      return onIntlHotReload(() => {
        void installLocale(activeLocale).then(() => forceUpdate());
      });
    }
  }, [activeLocale, forceUpdate]);

  const setNewActiveLocale = useCallback(async (newLocale: string) => {
    if (!isTranslationSupported(newLocale)) {
      throw new Error(`Locale ${newLocale} is unsupported`);
    }

    if (localeCookie !== newLocale) {
      setCookie(LOCALE_COOKIE_NAME, newLocale, { path: '/' });
    }

    return installLocale(newLocale).then(data => {
      setActiveLocale(newLocale);
      setMessages(data.messages);
    });
  }, [localeCookie, setCookie]);

  const activeLocaleContext = useMemo(() => {
    return {
      activeLocale,
      setActiveLocale: setNewActiveLocale,
    };
  }, [activeLocale, setNewActiveLocale]);

  return (
    <IntlProvider
      locale={activeLocale}
      // mute very annoying errors from react-intl
      // it's ok for messages to be missing during development.
      // add a CI check to ensure your localisation files are not missing a key or doesn't
      // contain an empty message during publish.
      defaultLocale={activeLocale}
      messages={messages}
    >
      <ActiveLocaleContext.Provider value={activeLocaleContext}>
        {props.children}
      </ActiveLocaleContext.Provider>
    </IntlProvider>
  );
}

function useForceUpdate() {
  const [, setDummy] = useState<number>(0);

  return useCallback(() => {
    setDummy(dummy => dummy + 1);
  }, []);
}
