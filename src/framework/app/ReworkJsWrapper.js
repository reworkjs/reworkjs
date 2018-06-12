import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import logger from '../../shared/logger';
import translationMessages from '../common/i18n';
import { store } from '../common/kernel';
import LanguageComponent from './LanguageComponent';
import BaseHelmet from './BaseHelmet';

export default function ReworkJsWrapper(props) {

  return (
    <div>
      <BaseHelmet />
      <Provider store={store}>
        <LanguageComponent messages={translationMessages}>
          {props.children}
        </LanguageComponent>
      </Provider>
    </div>
  );
}

ReworkJsWrapper.propTypes = {
  children: PropTypes.any,
};

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.SIDE === 'client') {
  try {
    require('offline-plugin/runtime').install();
  } catch (e) {
    logger.error('Service Worker could not be installed');
    logger.error(e);
  }
}
