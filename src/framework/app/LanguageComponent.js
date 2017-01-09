import React from 'react';
import { IntlProvider } from 'react-intl';
import { load as getCookie } from 'react-cookie';
import { isLocaleValid, onHotReload } from '../common/i18n';
import container from '../common/decorators/container';
import serverLocales from '../server/middlewares/serve-react-middleare/request-locale';
import LanguageProvider, { LOCALE_COOKIE_NAME } from './providers/LanguageProvider';

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
})
export default class LanguageComponent extends React.Component {
  static propTypes = {
    messages: React.PropTypes.object,
    locale: React.PropTypes.string.isRequired,
    changeLocale: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);

    props.changeLocale(guessPreferredLocale(), false);

    if (module.hot) {
      onHotReload(() => this.forceUpdate());
    }
  }

  render() {
    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

function guessPreferredLocale() {
  // TODO add hook ?

  const cookieLocale = getCookie(LOCALE_COOKIE_NAME);
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
  if (serverLocales) {
    for (const serverLocale of serverLocales) {
      if (isLocaleValid(serverLocale)) {
        return serverLocale;
      }
    }
  }

  return 'en';
}
