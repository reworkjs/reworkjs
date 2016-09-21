// Load the manifest.json file and the .htaccess file
// import '!file?name=[name].[ext]!./manifest.json';
// import 'file?name=[name].[ext]!./.htaccess';
import React from 'react';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router } from 'react-router';
import useScroll from 'react-router-scroll';
import offlinePlugin from 'offline-plugin/runtime';
import LanguageProvider from '../app/providers/LanguageProvider';
import translationMessages from '../common/i18n';
import { store, rootRoute } from '../common/kernel';

export default class App {

  constructor() {

    // Hot reloadable translation json files
    if (module.hot) {
      // modules.hot.accept does not accept dynamic dependencies,
      // have to be constants at compile-time
      module.hot.accept('../common/i18n', () => this.forceUpdate());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <Router
            history={history}
            routes={rootRoute}
            render={
              // Scroll to top when going to a new page, imitating default browser
              // behaviour
              applyRouterMiddleware(useScroll())
            } />
        </LanguageProvider>
      </Provider>
    );
  }
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
offlinePlugin.install();
