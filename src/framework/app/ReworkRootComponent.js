// @flow

import * as React from 'react';
import logger from '../../shared/logger';
import LanguageComponent from './LanguageComponent';
import BaseHelmet from './BaseHelmet';

type Props = {
  children: any,
};

export default function ReworkRootComponent(props: Props) {

  return (
    <React.Fragment>
      <BaseHelmet />
      <LanguageComponent>
        {props.children}
      </LanguageComponent>
    </React.Fragment>
  );
}

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
