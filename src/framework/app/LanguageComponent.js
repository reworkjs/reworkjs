import React from 'react';
import { IntlProvider } from 'react-intl';
import container from '../common/decorators/container';
import LanguageProvider from './providers/LanguageProvider';

/*
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */
@container({
  state: {
    locale: LanguageProvider.locale,
  },
})
export default class LanguageComponent extends React.Component {
  static propTypes = {
    locale: React.PropTypes.string,
    messages: React.PropTypes.object,
    children: React.PropTypes.element.isRequired,
  };

  constructor() {
    super();

    // Hot reloadable translation json files
    if (module.hot) {
      // modules.hot.accept does not accept dynamic dependencies,
      // have to be constants at compile-time
      module.hot.accept('../common/i18n', () => this.forceUpdate());
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
