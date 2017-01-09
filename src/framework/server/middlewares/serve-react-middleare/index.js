import React from 'react';
import { plugToRequest } from 'react-cookie';
import { parse } from 'accept-language-parser';
import { isProd } from '../../../../shared/EnvUtil';
import { getDefault } from '../../../../shared/util/ModuleUtil';
import logger from '../../../../shared/logger';
import ProdMiddleware from './ProdMiddleware';
import DevMiddleware from './DevMiddleware';
import { setRequestLocales } from './request-locale';

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
  /* eslint-disable */
  const { match, RouterContext } = require('react-router');
  const { renderToString } = require('react-dom/server');
  const { rootRoute, store } = require('../../../common/kernel');
  const App = getDefault(require('../../../app/ReworkJsWrapper'));
  /* eslint-enable */

  function matchAsync(routes, url) {
    return new Promise((resolve, reject) => {
      try {
        match({ routes, location: url }, (err, redirect, props) => {
          if (err) {
            reject(err);
          } else {
            resolve({ redirect, props });
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  const rootRoutes = [rootRoute];
  return async function serveApp(req, res) {

    try {
      const preRenderingData = await matchAsync(rootRoutes, req.url);
      const redirect = preRenderingData.redirect;
      const props = preRenderingData.props;

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search);
      }

      if (!props) {
        res.status(404).send('This is a 404 page. To define the page to actually render when a 404 occurs, please create a new route object and set its "status" property to 404 (int)');
        return;
      }

      const matchedRoute = props.routes[props.routes.length - 1];
      if (matchedRoute.status) {
        res.status(matchedRoute.status);
      }

      setRequestLocales(
        parse(req.header('Accept-Language'))
          .map(parsedLocale => {
            let localeStr = parsedLocale.code;

            if (parsedLocale.region) {
              localeStr += `-${parsedLocale.region}`;
            }

            return localeStr;
          }),
      );

      const unplugReactCookie = plugToRequest(req, res);

      const appHtml = renderToString(
        <App>
          <RouterContext {...props} />
        </App>,
      );

      unplugReactCookie();

      // TODO do we need to wrap appHtml in <div> here as well ?
      return await serveRoute(req, res, `<div>${appHtml}</div>`, store.getState());
    } catch (preRenderingError) {
      logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
      logger.error(preRenderingError);

      const status = preRenderingError.status || 500;
      res.status(status);

      try {
        return await serveRoute(req, res);
      } catch (serveError) {
        logger.error(`renderApp: could not serve route without server-side rendering to "${req.url}" due to an error:`);
        logger.error(serveError);

        return res.send('Something went wrong, sorry. :(');
      }
    }
  };
}
