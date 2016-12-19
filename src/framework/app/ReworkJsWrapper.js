import 'sanitize.css/sanitize.css';
import React from 'react';
import { Provider } from 'react-redux';
import { isProd, isClient } from '../../shared/EnvUtil';
import translationMessages from '../common/i18n';
import { store } from '../common/kernel';
import LanguageComponent from './LanguageComponent';

export default function ReworkJsWrapper(props) {

  return (
    <Provider store={store}>
      <LanguageComponent messages={translationMessages}>
        {props.children}
      </LanguageComponent>
    </Provider>
  );
}

ReworkJsWrapper.propTypes = {
  children: React.PropTypes.node,
};

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (isProd && isClient) {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
