// TODO Load the manifest.json file and the .htaccess file
// import '!file?name=[name].[ext]!./manifest.json';
// import 'file?name=[name].[ext]!./.htaccess';
import React from 'react';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';
import translationMessages from '../common/i18n';
import { store, rootRoute, history } from '../common/kernel';
import LanguageComponent from './LanguageComponent';

export default function App() {

  return (
    <Provider store={store}>
      <LanguageComponent messages={translationMessages}>
        <Router
          history={history}
          routes={rootRoute}
          render={
            // Scroll to top when going to a new page, imitating default browser behaviour
            applyRouterMiddleware(useScroll())
          }
        />
      </LanguageComponent>
    </Provider>
  );
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
