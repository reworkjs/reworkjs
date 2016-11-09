// import { createMemoryHistory } from 'history';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory, createMemoryHistory } from 'react-router';
import '../common/load-polyfills';
import { selectLocationState } from '../app/providers/RouteProvider/route-selectors';
import mainComponent from '../common/main-component';
import globals from '../../shared/globals';
import createRoutes from './create-routes';
import createStore from './create-store';

const isClient = globals.SIDE === 'client';

// useRouterHistory creates a composable higher-order function
const navigationHistory = isClient ? browserHistory : createMemoryHistory();
const initialState = {};
const store = createStore(initialState, navigationHistory);

const history = syncHistoryWithStore(navigationHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
  component: mainComponent,
  childRoutes: createRoutes(store),
};

export { rootRoute, history, store };
