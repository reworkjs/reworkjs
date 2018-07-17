import promiseAllProperties from 'promise-all-properties';
import { getDefault } from '../../shared/util/ModuleUtil';
import logger from '../../shared/logger';
import isPojo from '../../shared/util/is-pojo';

let routeCount = 0;

export default function createRoutes() {

  const routeLoader = require.context('@@directories.routes', true, /\.js$/);
  const fileNames = routeLoader.keys();

  if (fileNames.length === 0) {
    logger.warn('Your framework does not contain any route. Add your route descriptions in the directory specified by the "directories.routes" entry of your framework configuration file.');
  }

  return fileNames
    .map(file => {
      let route = getDefault(routeLoader(file));

      if (route == null) {
        return null;
      }

      if (typeof route !== 'object') {
        return null;
      }

      if (typeof route.toJSON === 'function') {
        route = route.toJSON() || route;
      }

      // only register those routes as children of other routes.
      if (route.standalone === false) {
        return null;
      }

      if (route.status === 404) {
        route.priority = route.priority || Number.MIN_SAFE_INTEGER + 1;
        route.path = route.path || '*';
      }

      if (route.status && Math.floor(route.status / 100) !== 2) {
        route.priority = route.priority || Number.MIN_SAFE_INTEGER;
        route.path = route.path || '*';
      }

      return route;
    })
    .filter(route => route !== null)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .map((route, i) => sanitizeRoute(route, fileNames[i]));
}

function assertUnique(singularMethodName, routeData, fileName) {
  const pluralMethodName = `${singularMethodName}s`;

  if (routeData[singularMethodName] && routeData[pluralMethodName]) {
    throw new TypeError(`Route ${JSON.stringify(fileName)}: cannot have both methods ${singularMethodName} and ${pluralMethodName} in the same route description.`);
  }
}

const SANITIZED = Symbol('sanitized');
export const ROUTE_ID = Symbol('route-id');
function sanitizeRoute(routeData, fileName) {

  if (typeof routeData.toJSON === 'function') {
    routeData = routeData.toJSON() || routeData;
  }

  // prevent resanitizing the same route,
  // can happen if the same route is used as the child of two parent routes.
  if (routeData[SANITIZED] === true) {
    return routeData;
  }

  routeData[SANITIZED] = true;

  routeData[ROUTE_ID] = routeCount++;

  assertUnique('getComponent', routeData, fileName);
  assertUnique('getSaga', routeData, fileName);
  assertUnique('getProvider', routeData, fileName);
  assertUnique('getReducer', routeData, fileName);

  // Add other possible sanitizations here.
  const route = Object.assign({}, routeData);

  if (route.getComponent) {
    route.getComponent = hookGetComponent(routeData, fileName);
  } else if (route.getComponents) {
    route.getComponents = hookGetComponent(routeData, fileName);
  } else {
    throw new TypeError(`Missing method getComponent(s) on route ${JSON.stringify(fileName)}`);
  }

  delete route.priority;

  if (route.children && route.childRoutes) {
    throw new TypeError(`Route ${JSON.stringify(fileName)} declares children twice (.children & .childRoutes), please use either methods.`);
  }

  if (route.children) {
    route.childRoutes = route.children;
    delete route.children;
  }

  if (route.childRoutes) {
    if (Array.isArray(route.childRoutes)) {
      route.childRoutes = route.childRoutes.map(subRoute => sanitizeRoute(subRoute, fileName));
    } else {
      route.childRoutes = [sanitizeRoute(route.childRoutes, fileName)];
    }
  }

  if (route.indexRoute) {
    route.indexRoute = sanitizeRoute(route.indexRoute, fileName);
  }

  return route;
}

function hookGetComponent(route, fileName) {
  return function callbackGetComponent(nextState) {

    // eslint-disable-next-line no-invalid-this
    return callComponentLoader.call(this, route, nextState, fileName);
  };
}

async function callComponentLoader(route, nextState, store, fileName) {
  const method = route.getComponent || route.getComponents;

  const components = await callLoader(method, route, nextState, store);

  if (!components) {
    throw new TypeError(`${JSON.stringify(fileName)}: getComponent(s) returned an invalid module.`);
  }

  if (!isPojo(components)) {
    return components;
  }

  return promiseAllProperties(components);
}

async function callLoader(loader, route, nextState, store) {
  if (!loader) {
    return null;
  }

  const rawOutput = await loader.call(route, nextState, store);

  if (rawOutput == null) {
    return null;
  }

  if (Array.isArray(rawOutput)) {
    if (rawOutput.length === 0) {
      return null;
    }

    const arrayOutput = await Promise.all(rawOutput);
    const arrayResult = [];
    for (let i = 0; i < arrayOutput.length; i++) {
      const item = arrayOutput[i];
      if (item != null) {
        arrayResult.push(getDefault(item));
      }
    }

    if (arrayResult.length === 0) {
      return null;
    }

    return arrayResult;
  }

  return getDefault(rawOutput);
}
