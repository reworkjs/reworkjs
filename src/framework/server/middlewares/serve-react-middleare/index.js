import React from 'react';
import { isProd } from '../../../../shared/EnvUtil';
import prod from './prod';
import dev from './dev';

export default function frontEndMiddleware(app, options) {
  const serveRoute = isProd ? prod(app, options) : dev(app, options);

  const serveApp = options.prerendering ? renderApp(serveRoute) : serveRoute;

  app.use(serveApp);
}

function renderApp(serveRoute) {
  /* eslint-disable global-require */
  const { match, RouterContext } = require('react-router');
  const { renderToString } = require('react-dom/server');
  const { rootRoute } = require('../../../common/kernel');
  const App = require('../../../app/App');
  /* eslint-enable global-require */

  return function serveApp(req, res) {
    match({ routes: [rootRoute], location: req.url }, (err, redirect, props) => {

      if (err) {
        return res.status(500).send(err.message);
      }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search);
      }

      if (props) {
        // TODO use react helmet here.
        // https://github.com/nfl/react-helmet#as-react-components
        const appHtml = renderToString(
          <App>
            <RouterContext {...props} />
          </App>,
        );

        return serveRoute(req, res, `<div>${appHtml}</div>`);
      }

      res.status(404).send('No route defined for path');
    });
  };
}
