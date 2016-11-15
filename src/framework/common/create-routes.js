import flatten from 'lodash/flatten';
import { getDefault } from '../../shared/util/ModuleUtil';
import { Symbols } from './decorators/provider';
import createAsyncInjectors from './create-async-injectors';

export default function createRoutes(store) {

  const routeLoader = require.context('@@directories.routes', true, /\.js$/);
  const fileNames = routeLoader.keys();

  if (fileNames.length === 0) {
    console.warn('Your framework does not contain any route. Add your route descriptions in the directory specified by the "directories.routes" entry of your framework configuration file.');
  }

  const injectors = createAsyncInjectors(store);

  return fileNames.map(file => getDefault(routeLoader(file)))
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .map((route, i) => sanitizeRoute(route, injectors, store, fileNames[i]));
}

function sanitizeRoute(routeData, injectors, store, fileName) {

  // Add other possible sanitizations here.
  const route = Object.assign({}, routeData);

  route.getComponent = unpromisifyGetComponent(routeData, injectors, store, fileName);

  delete route.getSaga;
  delete route.getSagas;
  delete route.getReducer;
  delete route.getReducers;
  delete route.getProvider;
  delete route.getProviders;
  delete route.priority;

  if (route.children) {
    if (Array.isArray(route.children)) {
      route.children = route.children.map(subRoute => sanitizeRoute(subRoute.children, injectors, store, fileName));
    } else {
      route.children = [sanitizeRoute(route.children, injectors, store, fileName)];
    }
  }

  return route;
}

function unpromisifyGetComponent(route, injectors, store, fileName) {
  if (!route.getComponent) {
    throw new TypeError(`Missing getComponent on route ${JSON.stringify(fileName)}`);
  }

  return async function callbackGetComponent(nextState, callback) {

    let __component; // eslint-disable-line
    try {
      const [component, sagas, reducers, providers] = await Promise.all([
        route.getComponent.call(route, nextState, store),
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

      if (!component) {
        throw new TypeError(`${JSON.stringify(fileName)}: getComponent returned an invalid module.`);
      }

      __component = getDefault(component);
    } catch (e) {
      __component = null;
      console.error(`Error while loading route ${JSON.stringify(fileName)}`, e);
      callback(e);
    }

    if (__component) {
      try {
        callback(null, __component);
      } catch (e) {
        console.error(`Error while rendering route ${JSON.stringify(fileName)}`, e);
      }
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
    injectors.injectReducer(reducers.name, reducers);
    return;
  }

  for (const reducer of reducers) {
    injectors.injectReducer(reducer.name, reducer);
  }
}

/*
 * Unifies the possible outputs of route.getSaga-s
 */
async function callSagaLoader(route, nextState, store) {
  const method = route.getSagas || route.getSaga;
  const sagas = await callLoader(method, route, nextState, store);

  return sagas ? flatten(sagas) : sagas;
}

async function callProviderLoader(route, nextState, store) {
  const method = route.getProvider || route.getProviders;
  const providers = await callLoader(method, route, nextState, store);

  return providers ? flatten(providers) : providers;
}

/*
 * Unifies the possible outputs of route.getReducer-s
 */
function callReducerLoader(route, nextState, store) {
  const method = route.getReducers || route.getReducer;
  return callLoader(method, route, nextState, store);
}

async function callLoader(loader, route, nextState, store) {
  if (!loader) {
    return null;
  }

  const rawOutput = await loader.call(route, nextState, store);

  if (Array.isArray(rawOutput)) {
    if (rawOutput.length === 0) {
      return null;
    }

    const arrayOutput = await Promise.all(rawOutput);
    return arrayOutput.map(output => getDefault(output));
  }

  const output = getDefault(rawOutput);
  if (Array.isArray(output)) {
    return output;
  }

  return [output];
}
