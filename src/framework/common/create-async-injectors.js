import conformsTo from 'lodash/conformsTo';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import createReducer from './create-reducer';
import { Symbols } from './decorators/provider';

/**
 * Validate the shape of redux store
 */
function checkStore(store) {

  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    asyncReducers: isObject,
  };

  if (!conformsTo(store, shape)) {
    throw new TypeError('asyncInjectors: Expected a valid redux store');
  }
}

/**
 * Inject an asynchronously loaded reducer
 */
function createAsyncReducerInjector(store) {
  return function injectReducer(asyncReducer) {
    const name = asyncReducer[Symbols.name] || asyncReducer.name;

    if (!isString(name) || isEmpty(name)) {
      throw new TypeError('injectAsyncReducer: reducer is missing a name.');
    }

    if (!isFunction(asyncReducer)) {
      throw new TypeError('injectAsyncReducer: reducer is not a function.');
    }

    // replace reducer
    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };
}

/**
 * Inject an asynchronously loaded saga
 */
function createAsyncSagaInjector(store) {
  return function injectSagas(sagas) {
    if (!Array.isArray(sagas)) {
      throw new TypeError('(app/utils...) injectAsyncSagas: Expected `sagas` to be an array of generator functions');
    }

    if (isEmpty(sagas)) {
      console.warn('(app/utils...) injectAsyncSagas: Received an empty `sagas` array');
    }

    sagas.forEach(store.runSaga);
  };
}

/**
 * Helper for creating injectors
 */
export default function createAsyncInjectors(store) {
  checkStore(store);

  return {
    injectReducer: createAsyncReducerInjector(store),
    injectSagas: createAsyncSagaInjector(store),
  };
}
