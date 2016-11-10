import React from 'react';
import { IntlProvider } from 'react-intl';
import { isLocaleValid, onHotReload } from '../common/i18n';
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

    props.changeLocale(getStartLocale());

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

function getStartLocale() {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

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

  return 'en';
}
