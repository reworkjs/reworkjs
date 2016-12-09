import React from 'react';
import { isProd } from '../../../../shared/EnvUtil';
import { getDefault } from '../../../../shared/util/ModuleUtil';
import logger from '../../../../shared/logger';
import ProdMiddleware from './ProdMiddleware';
import DevMiddleware from './DevMiddleware';

export default function frontEndMiddleware(app, config) {
  logger.info('Building your client-side app, this might take a minute.');

  const Middleware = isProd ? ProdMiddleware : DevMiddleware;
  const middleware = new Middleware(app, config);

  let serveRoute = middleware.serveRoute.bind(middleware);
  if (config.prerendering) {
    serveRoute = renderApp(serveRoute);
  }

  middleware.registerMiddlewares(serveRoute);
  app.use(serveRoute);
}

function renderApp(serveRoute) {
  /* eslint-disable global-require */
  const { match, RouterContext } = require('react-router');
  const { renderToString } = require('react-dom/server');
  const { rootRoute } = require('../../../common/kernel');
  const App = getDefault(require('../../../app/ReworkJsWrapper'));
  /* eslint-enable global-require */

  return function serveApp(req, res) {
    // TODO mechanism for 404, 500, ... routes rendering (as in render the error page).
    match({ routes: [rootRoute], location: req.url }, (err, redirect, props) => {

      if (err) {
        return res.status(500).send(err.message);
      }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search);
      }

      if (props) {
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
