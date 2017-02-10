import conformsTo from 'lodash/conformsTo';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import createReducer from './create-reducer';

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
  return function injectReducer(name, asyncReducer) {
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
