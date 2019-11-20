// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import { loadableReady } from '@loadable/component';
import logger from '../../shared/logger';
import RootComponent from './root-component';

const appContainer = document.getElementById('app');
if (appContainer.hasChildNodes()) {
  // ensure all needed chunks are loaded before hydrating to prevent flicker
  loadableReady(() => {
    ReactDOM.hydrate(
      <RootComponent />,
      appContainer,
    );
  });
} else {
  ReactDOM.render(
    <RootComponent />,
    appContainer,
  );
}

// remove server-generated CSS
serverStyleCleanup();

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
