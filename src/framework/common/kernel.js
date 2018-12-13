// @flow

import React from 'react';
import { Switch } from 'react-router-dom';
import MainComponent from '../common/main-component';
import createRoutes from './router/create-routes';
import debug from './debug';

// Set up the router, wrapping all Routes in the App component

const topLevelRoutes = createRoutes();

debug.topLevelRoutes = topLevelRoutes;

const rootRoute = (
  <MainComponent>
    <Switch>
      {topLevelRoutes}
    </Switch>
  </MainComponent>
);

export { rootRoute };
