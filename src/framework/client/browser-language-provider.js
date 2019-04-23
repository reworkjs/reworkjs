// @flow

import React from 'react';
import { LanguageContext } from '../common/accept-language-context';

type Props = {
  children: any,
};

type State = {
  languages: string[],
};

const LANGUAGE_CHANGE_EVENT = 'languagechange';

/**
 * Provides the user language preferences as defined in their browser.
 * Will re-render on change.
 */
export default class BrowserLanguageProvider extends React.Component<Props, State> {

  state = {
    languages: getLanguages(),
  };

  languageChangeListener = () => {
    // eslint-disable-next-line no-invalid-this
    this.setState({ languages: getLanguages() });
  };

  componentDidMount(): void {
    window.addEventListener(LANGUAGE_CHANGE_EVENT, this.languageChangeListener);
  }

  componentWillUnmount(): void {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, this.languageChangeListener);
  }

  render() {

    return (
      <LanguageContext.Provider value={this.state.languages}>
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

function getLanguages() {
  return Object.freeze([...navigator.languages]);
}
