import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import global from 'global';
import { getDefault } from '../../shared/util/ModuleUtil';
import createReducer from './create-reducer';
import providers from './providers';
import { Symbols } from './decorators/provider';
import debug from './debug';

const sagaMiddleware = createSagaMiddleware();
const devtools = global.devToolsExtension || (() => noop => noop);

export default function configureStore(history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
  ];

  const enhancers = [
    replaceActionDispatcher,
    applyMiddleware(...middlewares),
    devtools(),
  ];

  const initialState = global.__PRELOADED_STATE__ || {};

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    compose(...enhancers),
  );

  const activeSagas = [];
  debug.activeSagas = activeSagas;

  // Create hook for async sagas
  store.runSaga = function runSaga(saga) {
    if (activeSagas.includes(saga)) {
      return;
    }

    sagaMiddleware.run(saga);
    activeSagas.push(saga);
  };

  debug.store = store;

  loadProviderSagas(store);

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    import('./create-reducer').then(reducerModule => {
      const createReducers = getDefault(reducerModule);
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(nextReducers);
    });
  }

  // Initialize it with no other reducers
  store.asyncReducers = {};
  return store;
}

function loadProviderSagas(store) {
  for (const provider of providers) {
    const sagas = provider[Symbols.sagas] || provider.sagas;
    if (!sagas) {
      continue;
    }

    for (const saga of sagas) {
      store.runSaga(saga);
    }
  }
}

function replaceActionDispatcher(actualCreateStore) {
  return function fakeCreateStore(a, b, c) {
    const store = actualCreateStore(a, b, c);
    const nativeDispatch = store.dispatch;

    Object.assign(store, {
      dispatch(arg) {
        if (Array.isArray(arg)) {
          for (const action of arg) {
            nativeDispatch.call(this, action);
          }
        } else {
          nativeDispatch.call(this, arg);
        }
      },
    });

    return store;
  };
}
