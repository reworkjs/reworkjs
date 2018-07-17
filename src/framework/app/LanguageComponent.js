// @flow

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Cookies, withCookies } from 'react-cookie';
import { guessPreferredLocale } from '../common/i18n/get-preferred-locale';
import {
  getActiveLocale,
  getReactIntlMessages,
  offActiveLocaleChange,
  onActiveLocaleChange,
  onIntlHotReload,
  setActiveLocale,
} from '../common/i18n/index';

type Props = {
  children: any,
  cookies: Cookies,
};

type State = {
  activeLocale: string,
};

/**
 * this component synchronizes the internal i18n state with react-intl.
 */
@withCookies()
export default class LanguageComponent extends React.Component<Props, State> {

  state = {
    activeLocale: getActiveLocale(),
  };

  constructor(props: Props) {
    super(props);

    // $FlowFixMe
    if (module.hot) {
      onIntlHotReload(() => this.forceUpdate());
    }

    // $FlowFixMe
    this.onActiveLocaleChange = this.onActiveLocaleChange.bind(this);
  }

  componentDidMount() {
    onActiveLocaleChange(this.onActiveLocaleChange);

    setActiveLocale(guessPreferredLocale(this.props.cookies));
  }

  componentWillUnmount() {
    offActiveLocaleChange(this.onActiveLocaleChange);
  }

  onActiveLocaleChange(newLocale: string) {
    this.setState({ activeLocale: newLocale });
  }

  render() {

    return (
      <IntlProvider
        locale={this.state.activeLocale}
        messages={getReactIntlMessages()}
        textComponent={React.Fragment}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}
