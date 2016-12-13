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

  const statusRoutes = prepareStatusRoutes(rootRoute);
  const rootRoutes = [rootRoute];
  return async function serveApp(req, res) {

    let redirect;
    let props;
    try {
      const matchedRoute = await matchAsync(rootRoutes, req.url, match);
      redirect = matchedRoute.redirect;
      props = matchedRoute.props;
    } catch (error) {
      logger.error(`renderApp: "${req.url}" could not be served due to an error:`);
      logger.error(error);

      const status = error.status || 500;
      res.status(status);

      try {
        const errorRoute = await matchStatus(statusRoutes, status, req, match);
        if (!errorRoute) {
          res.send(`No route has been defined for error status "${status}" and url "${req.url}".`);
          return;
        }

        redirect = errorRoute.redirect;
        props = errorRoute.props;
      } catch (e) {
        logger.error(`renderApp: could not send route for status "${status}" to "${req.url}" due to an error:`);
        logger.error(e);

        res.send('Something went wrong, sorry. :(');
        return;
      }
    }

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

    const appHtml = renderToString(
      <App>
        <RouterContext {...props} />
      </App>,
    );

    return serveRoute(req, res, `<div>${appHtml}</div>`);
  };
}

async function matchStatus(statusRoutes, status, req, match) {
  const routes = statusRoutes[status] || statusRoutes[500];
  if (!routes) {
    return null;
  }

  return matchAsync(routes, req.url, match);
}

function matchAsync(routes, url, match) {
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

function prepareStatusRoutes(rootRoute) {
  const statusRoutes = {};
  findUsedStatuses(statusRoutes, rootRoute);

  for (const status of Object.keys(statusRoutes)) {
    statusRoutes[status] = cloneForStatus(rootRoute, Number(status));
  }

  return statusRoutes;
}

/*
 * If the route has the right status, keep it.
 * If the route has a child with the right status, keep it.
 * Otherwise, discard the route.
 */
function cloneForStatus(route, status: number) {

  // cannot have a path if the status is the right one otherwise it might match a 200.
  if (route.path && route.status !== status) {
    return null;
  }

  // Remove all children that do not match the status.
  if (hasChildren(route)) {
    const newChildren = [];
    for (let i = 0; i < route.childRoutes.length; i++) {
      const newChild = cloneForStatus(route.childRoutes[i], status);

      if (newChild !== null) {
        newChildren.push(newChild);
      }
    }

    if (newChildren.length !== route.childRoutes.length) {
      route = Object.assign({}, route);
      route.childRoutes = newChildren;
    }
  }

  if (route.status === status || hasChildren(route)) {
    return route;
  }

  return null;
}

function hasChildren(route) {
  return route.childRoutes && route.childRoutes.length > 0;
}

function findUsedStatuses(statusRoutes, route) {
  if (route.status) {
    statusRoutes[route.status] = statusRoutes[route.status] || [];
  }

  if (route.childRoutes) {
    for (const child of route.childRoutes) {
      findUsedStatuses(statusRoutes, child);
    }
  }
}
