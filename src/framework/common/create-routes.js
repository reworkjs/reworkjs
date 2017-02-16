import promiseAllProperties from 'promise-all-properties';
import flatten from 'lodash/flatten';
import { getDefault } from '../../shared/util/ModuleUtil';
import logger from '../../shared/logger';
import isPojo from '../util/is-pojo';
import { Symbols } from './decorators/provider';
import createAsyncInjectors from './create-async-injectors';

export default function createRoutes(store) {

  const routeLoader = require.context('@@directories.routes', true, /\.js$/);
  const fileNames = routeLoader.keys();

  if (fileNames.length === 0) {
    logger.warn('Your framework does not contain any route. Add your route descriptions in the directory specified by the "directories.routes" entry of your framework configuration file.');
  }

  const injectors = createAsyncInjectors(store);

  return fileNames
    .map(file => {
      const route = getDefault(routeLoader(file));

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
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .map((route, i) => sanitizeRoute(route, injectors, store, fileNames[i]));
}

function assertUnique(singularMethodName, routeData, fileName) {
  const pluralMethodName = `${singularMethodName}s`;

  if (routeData[singularMethodName] && routeData[pluralMethodName]) {
    throw new TypeError(`Route ${JSON.stringify(fileName)}: cannot have both methods ${singularMethodName} and ${pluralMethodName} in the same route description.`);
  }
}

function sanitizeRoute(routeData, injectors, store, fileName) {

  assertUnique('getComponent', routeData, fileName);
  assertUnique('getSaga', routeData, fileName);
  assertUnique('getProvider', routeData, fileName);
  assertUnique('getReducer', routeData, fileName);

  // Add other possible sanitizations here.
  const route = Object.assign({}, routeData);

  if (route.getComponent) {
    route.getComponent = unpromisifyGetComponent(routeData, injectors, store, fileName);
  } else if (route.getComponents) {
    route.getComponents = unpromisifyGetComponent(routeData, injectors, store, fileName);
  } else {
    throw new TypeError(`Missing method getComponent(s) on route ${JSON.stringify(fileName)}`);
  }

  // onEnter(nextState, replace, callback?)
  // onChange(prevState, nextState, replace, callback?)
  // onLeave(prevState)
  if (route.onEnter) {
    const oldOnEnter = route.onEnter;
    route.onEnter = function onEnter(nextState, replace) {
      return oldOnEnter.call(this, nextState, replace, store);
    };
  }

  if (route.onChange) {
    const oldOnChange = route.onChange;
    route.onChange = function onChange(prevState, nextState, replace) {
      return oldOnChange.call(this, prevState, nextState, replace, store);
    };
  }

  if (route.onLeave) {
    const oldOnLeave = route.onLeave;
    route.onLeave = function onLeave(prevState) {
      return oldOnLeave.call(this, prevState, store);
    };
  }

  delete route.getSaga;
  delete route.getSagas;
  delete route.getReducer;
  delete route.getReducers;
  delete route.getProvider;
  delete route.getProviders;
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
      route.childRoutes = route.childRoutes.map(subRoute => sanitizeRoute(subRoute, injectors, store, fileName));
    } else {
      route.childRoutes = [sanitizeRoute(route.childRoutes, injectors, store, fileName)];
    }
  }

  return route;
}

function unpromisifyGetComponent(route, injectors, store, fileName) {
  return async function callbackGetComponent(nextState, callback) {

    try {
      const [component, sagas, reducers, providers] = await Promise.all([
        callComponentLoader(route, nextState, store, fileName),
        callSagaLoader(route, nextState, store),
        callReducerLoader(route, nextState, store),
        callProviderLoader(route, nextState, store),
      ]);

      injectSagas(injectors, sagas);
      injectReducers(injectors, reducers);

      if (providers) {
        for (const provider of providers) {
          injectSagas(injectors, provider[Symbols.sagas]);
          injectReducers(injectors, provider[Symbols.reducer]);
        }
      }

      try {
        callback(null, component);
      } catch (e) {
        logger.error(`Error while rendering route ${JSON.stringify(fileName)}`, e);
      }
    } catch (e) {
      logger.error(`Error while loading route ${JSON.stringify(fileName)}`, e);
      callback(e);
    }
  };
}

function injectSagas(injectors, sagas) {
  if (sagas && sagas.length > 0) {
    injectors.injectSagas(sagas);
  }
}

function injectReducers(injectors, reducers) {
  if (!reducers) {
    return;
  }

  if (!Array.isArray(reducers)) {
    injectors.injectReducer(reducers);
    return;
  }

  for (const reducer of reducers) {
    injectors.injectReducer(reducer);
  }
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

async function callSagaLoader(route, nextState, store) {
  const method = route.getSaga || route.getSagas;
  const sagas = toArray(await callLoader(method, route, nextState, store));

  return sagas ? flatten(sagas) : sagas;
}

async function callProviderLoader(route, nextState, store) {
  const method = route.getProvider || route.getProviders;
  const providers = toArray(await callLoader(method, route, nextState, store));

  return providers ? flatten(providers) : providers;
}

/*
 * Unifies the possible outputs of route.getReducer-s
 */
async function callReducerLoader(route, nextState, store) {
  const method = route.getReducer || route.getReducers;
  return toArray(await callLoader(method, route, nextState, store));
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

    return arrayResult;
  }

  return getDefault(rawOutput);
}

function toArray(obj) {
  if (obj == null) {
    return [];
  }

  if (Array.isArray(obj)) {
    return obj;
  }

  return [obj];
}
