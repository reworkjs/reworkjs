import { conformsTo, isEmpty, isObject, isString, isFunction } from 'lodash';
import forEach from '../../shared/util/for-each';
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
  return function injectReducer(asyncReducers) {

    let dirty = false;
    forEach(asyncReducers, reducer => {
      const name = reducer[Symbols.name] || reducer.name;

      if (!isString(name) || isEmpty(name)) {
        throw new TypeError('injectAsyncReducer: reducer is missing a name.');
      }

      if (!isFunction(reducer)) {
        throw new TypeError('injectAsyncReducer: reducer is not a function.');
      }

      if (store.asyncReducers[name] === reducer) {
        return;
      }

      store.asyncReducers[name] = reducer;
      dirty = true;
    });

    if (dirty) {
      store.replaceReducer(createReducer(store.asyncReducers));
    }
  };
}

/**
 * Inject an asynchronously loaded saga
 */
function createAsyncSagaInjector(store) {
  return function injectSagas(sagas) {
    forEach(sagas, store.runSaga);
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
