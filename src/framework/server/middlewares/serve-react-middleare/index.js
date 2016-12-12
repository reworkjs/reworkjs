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
    match({ routes: [rootRoute], location: req.url }, (err, redirect, props) => {

      if (err) {
        // TODO 500
        return res.status(500).send(err.message);
      }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search);
      }

      if (!props) {
        res.status(404).send('This is a 404 page. To define the page to actually render when a 404 occurs, please create a new route object and set its "status" property to 404 (int)');
      }

      const matchedRoute = props.routes[props.routes.length - 1];
      if (matchedRoute.status) {
        res.status(matchedRoute.status);
      }

      if (props) {
        // TODO catch 500
        const appHtml = renderToString(
          <App>
            <RouterContext {...props} />
          </App>,
        );

        return serveRoute(req, res, `<div>${appHtml}</div>`);
      }
    });
  };
}

