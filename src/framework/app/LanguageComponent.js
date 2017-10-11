import React from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { Cookies } from 'react-cookie';
import { isLocaleValid, onHotReload } from '../common/i18n';
import container from '../common/decorators/container';
import { getCurrentRequestLocales } from '../server/setup-http-server/request-locale';
import LanguageProvider, { LOCALE_COOKIE_NAME } from './providers/LanguageProvider';

function Fragment(props) {
  return props.children;
}

/*
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */
@container({
  state: {
    locale: LanguageProvider.locale,
  },
  actions: {
    changeLocale: LanguageProvider.changeLocale,
  },
  cookies: true,
})
export default class LanguageComponent extends React.Component {
  static propTypes = {
    messages: PropTypes.object,
    locale: PropTypes.string.isRequired,
    changeLocale: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);

    props.changeLocale(guessPreferredLocale(props.cookies), false);

    if (module.hot) {
      onHotReload(() => this.forceUpdate());
    }
  }

  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        messages={this.props.messages[this.props.locale]}
        node={Fragment}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

function guessPreferredLocale(cookies) {
  // TODO add hook ?

  const cookieLocale = cookies.get(LOCALE_COOKIE_NAME);
  if (cookieLocale && isLocaleValid(cookieLocale)) {
    return cookieLocale;
  }

  // client-side
  if (typeof navigator !== 'undefined') {
    if (navigator.languages) {
      for (const language of navigator.languages) {
        if (isLocaleValid(language)) {
          return language;
        }
      }
    }

    if (isLocaleValid(navigator.language)) {
      return navigator.language;
    }
  }

  // server-side
  const serverLocales = getCurrentRequestLocales();
  if (serverLocales) {
    for (const serverLocale of serverLocales) {
      if (isLocaleValid(serverLocale)) {
        return serverLocale;
      }
    }
  }

  return 'en';
}
