import { createBrowserHistory, createMemoryHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';
import { useRouterHistory } from 'react-router';
import { selectLocationState } from '../app/providers/RouteProvider/route-selectors';
import mainComponent from '../common/main-component';
import createRoutes from './create-routes';
import createStore from './create-store';

// TODO load polyfills and call pre-init.
const isServer = process.env.SIDE === 'server';

// useRouterHistory creates a composable higher-order function
const navigationHistory = useRouterHistory(isServer ? createMemoryHistory : createBrowserHistory)();
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
