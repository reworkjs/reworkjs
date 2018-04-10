import React from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { Cookies } from 'react-cookie';
import { guessPreferredLocale } from '../common/get-preferred-locale';
import { onHotReload } from '../common/i18n';
import container from '../common/decorators/container';
import LanguageProvider from './providers/LanguageProvider';

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
        textComponent={Fragment}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}
