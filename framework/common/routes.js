import flatten from 'lodash/flatten';
import { getDefault } from '../util/ModuleUtil';
import { getAsyncInjectors } from './asyncInjectors';

export default function createRoutes(store) {

  const injectors = getAsyncInjectors(store);

  // Dynamically load all route files.
  const reqAll = require.context('./routes/', true, /\.js$/);

  return reqAll.keys()
    .map(fileName => getDefault(reqAll(fileName)))
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .map(route => sanitizeRoute(route, injectors, store));
}

function sanitizeRoute(routeData, injectors, store) {

  // Add other possible sanitizations here.
  const route = Object.assign({}, routeData);

  route.getComponent = unpromisifyGetComponent(routeData, injectors, store);
  delete route.getSagas;
  delete route.getReducer;
  delete route.priority;

  return route;
}

function unpromisifyGetComponent(route, injectors, store) {
  if (!route.getComponent) {
    throw new Error(`Missing getComponent on route ${JSON.stringify(route, null, 2)}`);
  }

  return async function callbackGetComponent(nextState, callback) {

    try {
      const [component, sagas, reducers] = await Promise.all([
        route.getComponent.call(route, nextState, store),
        callSagaLoader(route, nextState, store),
        callReducerLoader(route, nextState, store),
      ]);

      if (sagas) {
        injectors.injectSagas(sagas);
      }

      if (reducers) {
        for (const reducer of reducers) {
          injectors.injectReducer(reducer.name, reducer);
        }
      }

      callback(null, getDefault(component));
    } catch (e) {
      onError(e);
      callback(e);
    }
  };
}

/**
 * Unifies the possible outputs of route.getSaga-s
 */
async function callSagaLoader(route, nextState, store) {
  const method = route.getSagas || route.getSaga;
  const sagas = await callLoader(method, route, nextState, store);

  return sagas ? flatten(sagas) : sagas;
}

/**
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

function onError(err) {
  // TODO proper error handling.
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
}
