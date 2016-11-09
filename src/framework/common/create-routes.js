import flatten from 'lodash/flatten';
import { getDefault } from '../../shared/util/ModuleUtil';
import createAsyncInjectors from './create-async-injectors';
import routeModules from './routes';

export default function createRoutes(store) {

  const injectors = createAsyncInjectors(store);

  return routeModules
    .map(routeModule => getDefault(routeModule))
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

    let __component; // eslint-disable-line
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

      __component = getDefault(component);
    } catch (e) {
      __component = null;
      console.error('Error while loading route', e);
      callback(e);
    }

    if (__component) {
      try {
        callback(null, __component);
      } catch (e) {
        console.error('Error while rendering route', e);
      }
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
