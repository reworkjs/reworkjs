// import assert from 'assert';
import conformsTo from 'lodash/conformsTo';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import createReducer from './create-reducer';

/**
 * Validate the shape of redux store
 */
export function checkStore(store) {

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
export function createAsyncReducerInjector(store, isValid) {
  return function injectReducer(name, asyncReducer) {
    if (!isValid) {
      checkStore(store);
    }

    if (!isString(name) || isEmpty(name) || !isFunction(asyncReducer)) {
      throw new TypeError('injectAsyncReducer: Expected `asyncReducer` to be a reducer function');
    }

    store.asyncReducers[name] = asyncReducer; // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.asyncReducers));
  };
}

/**
 * Inject an asynchronously loaded saga
 */
export function createAsyncSagaInjector(store, isValid) {
  return function injectSagas(sagas) {
    if (!isValid) {
      checkStore(store);
    }

    if (!Array.isArray(sagas)) {
      throw new TypeError('(app/utils...) injectAsyncSagas: Expected `sagas` to be an array of generator functions');
    }

    if (isEmpty(sagas)) {
      console.warn('(app/utils...) injectAsyncSagas: Received an empty `sagas` array');
    }

    sagas.map(store.runSaga);
  };
}

/**
 * Helper for creating injectors
 */
export default function createAsyncInjectors(store) {
  checkStore(store);

  return {
    injectReducer: createAsyncReducerInjector(store, true),
    injectSagas: createAsyncSagaInjector(store, true),
  };
}
