// Load the manifest.json file and the .htaccess file
// import '!file?name=[name].[ext]!./manifest.json';
// import 'file?name=[name].[ext]!./.htaccess';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createHistory } from 'history/lib';
import useScroll from 'react-router-scroll';
import offlinePlugin from 'offline-plugin/runtime';
import LanguageProvider from '../app/providers/LanguageProvider';
import { selectLocationState } from '../app/providers/RouteProvider/route-selectors';
import configureStore from './store';
import { translationMessages } from './i18n';
import createRoutes from './routes';
import mainComponent from './main-component';

// TODO load polyfills and call pre-init.

const browserHistory = useRouterHistory(createHistory)();
const initialState = {};
const store = configureStore(initialState, browserHistory);

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
  component: mainComponent,
  childRoutes: createRoutes(store),
};

function render(translatedMessages) {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={translatedMessages}>
        <Router
          history={history}
          routes={rootRoute}
          render={
              // Scroll to top when going to a new page, imitating default browser
              // behaviour
              applyRouterMiddleware(useScroll())
            } />
      </LanguageProvider>
    </Provider>,
    document.getElementById('app'),
  );
}

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages);
  });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
offlinePlugin.install();
