// @flow

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Cookies, withCookies } from 'react-cookie';
import { ActiveLocaleContext } from '../common/active-locale-context';
import { isTranslationSupported, type ReactIntlMessages } from '../common/i18n/_app-translations';
import { guessPreferredLocale, storePreferredLocale } from '../common/i18n/get-preferred-locale';
import {
  onIntlHotReload,
  installLocale,
} from '../common/i18n';
import { LanguageContext } from '../common/accept-language-context';
import withContext from '../common/with-context';

type Props = {
  children: any,
  cookies: Cookies,
  acceptLanguages: string[],
};

type State = {
  activeLocale: string,
  messages: ReactIntlMessages,
};

/**
 * this component synchronizes the internal i18n state with react-intl.
 */
@withCookies
@withContext({ acceptLanguages: LanguageContext })
export default class LanguageComponent extends React.Component<Props, State> {

  state = {
    // TODO(DEFAULT_LOCALE): use default locale instead of 'en'
    activeLocale: 'en',
    messages: {},
  };

  constructor(props: Props) {
    super(props);

    // $FlowFixMe
    this.setActiveLocale = this.setActiveLocale.bind(this);

    // $FlowFixMe
    if (module.hot) {
      onIntlHotReload(() => {
        installLocale(this.state.activeLocale).then(() => this.forceUpdate());
      });
    }
  }

  componentDidMount() {
    const activeLocale = guessPreferredLocale(this.props.cookies, this.props.acceptLanguages);

    installLocale(activeLocale).then(data => {
      this.setState({
        messages: data.messages,
        activeLocale,
      });
    });
  }

  setActiveLocale(newLocale: string) {
    if (!isTranslationSupported(newLocale)) {
      throw new Error(`Locale ${newLocale} is unsupported`);
    }

    storePreferredLocale(this.props.cookies, newLocale);

    return installLocale(newLocale).then(data => {
      this.setState({
        messages: data.messages,
        activeLocale: newLocale,
      });
    });
  }

  get activeLocaleContext(): Object {

    return {
      activeLocale: this.state.activeLocale,
      setActiveLocale: this.setActiveLocale,
    };
  }

  render() {

    return (
      <IntlProvider
        locale={this.state.activeLocale}
        messages={this.state.messages}
      >
        <ActiveLocaleContext.Provider value={this.activeLocaleContext}>
          {this.props.children}
        </ActiveLocaleContext.Provider>
      </IntlProvider>
    );
  }
}
