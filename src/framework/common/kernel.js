// @flow

import { browserHistory, createMemoryHistory } from 'react-router';
import mainComponent from '../common/main-component';
import createRoutes from './create-routes';
import debug from './debug';

// useRouterHistory creates a composable higher-order function
const navigationHistory = process.env.SIDE === 'client' ? browserHistory : createMemoryHistory();

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
  component: mainComponent,
  childRoutes: createRoutes(),
};

debug.rootRoute = rootRoute;

export {
  rootRoute,
  navigationHistory as history,
};
