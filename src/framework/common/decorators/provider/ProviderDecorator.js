import { fromJS, Collection } from 'immutable';
import { takeLatest } from 'redux-saga';
import { createSelector } from 'reselect';
import { Symbols } from '../provider';
import { reducerMetadata } from './ReducerDecorator';
import { isSaga } from './SagaDecorator';
import { isActionGenerator } from './ActionDecorator';

const stateHolderSymbol = Symbol('state-holder');
const mutatedProperties = Symbol('mutatedProperties');
const PROPERTY_BLACKLIST = ['length', 'name', 'prototype', 'arguments', 'caller', 'callee'];

function denyAccess() {
  throw new Error('Cannot access @provider state outside of @reducer annotated methods. If you are trying to r/w the state from a @saga, you will need to use => yield put(this.<reducerMethodName>()) <=');
}

const IMMUTABLE_STATE = {
  set: denyAccess,
  get: denyAccess,
};

/**
 * Decorator that transforms a static class into a provider
 *
 * how it works:
 * - Methods become action builders,
 *   calling them will create an action of the right type with the parameters as payload.
 * - The logic of those methods is moved inside reducers and sagas
 *   depending on if they are annotated with @reducer or @saga
 * - Getting fields return a selector
 * - Setting fields throw an error if called from outside
 *   a @reducer annotated method and call state.set(fieldName, fieldValue) otherwise
 */
export default function provider(providerClass) {

  if (typeof providerClass !== 'function') {
    // optional ()
    return provider;
  }

  if (Object.getOwnPropertyNames(providerClass.prototype).length > 1) {
    console.error(`@provider ${providerClass.name} has instance properties. This is likely a bug as providers are fully static.`);
  }

  const domainIdentifier = providerClass.name;

  function selectDomain() {
    return state => {
      const domain = state.get(domainIdentifier);

      if (domain === void 0) {
        throw new Error(`Could not retrieve the store subdomain ${JSON.stringify(domainIdentifier)}. Either the associated reducer is not loaded or it is loaded under a different name.`);
      }

      return domain;
    };
  }

  providerClass[stateHolderSymbol] = IMMUTABLE_STATE;
  const { initialState, sagaList, actionListeners } = extractFromProvider(providerClass, selectDomain);

  function genericReducer(state = initialState, actionData) {
    const type = actionData.type;

    const actionHandler = actionListeners.get(type);
    if (!actionHandler) {
      return state;
    }

    return state.withMutations(map => {
      providerClass[stateHolderSymbol] = map;
      const mutatedObjectMap = new Map();
      providerClass[mutatedProperties] = mutatedObjectMap;

      if (Array.isArray(actionHandler)) {
        for (const actionHandlerItem of actionHandler) {
          actionHandlerItem.apply(providerClass, actionData.payload);
        }
      } else {
        actionHandler.apply(providerClass, actionData.payload);
      }

      mutatedObjectMap.forEach((value, key) => {
        map = map.set(value, fromJS(key));
      });

      providerClass[stateHolderSymbol] = IMMUTABLE_STATE;
    });
  }

  genericReducer[Symbols.name] = domainIdentifier;
  attemptChangeName(genericReducer, `${providerClass.name}@reducer`);

  providerClass[Symbols.reducer] = genericReducer;
  providerClass[Symbols.sagas] = sagaList;

  return providerClass;
}

provider.useSymbols = true;

function extractFromProvider(providerClass, selectDomain) {
  const actionListeners = new Map();
  const sagaList = [];
  const initialState = {};
  const keys = Object.getOwnPropertyNames(providerClass);
  for (const propertyName of keys) {
    if (PROPERTY_BLACKLIST.includes(propertyName)) {
      continue;
    }

    const property = providerClass[propertyName];
    const propIsAction = property != null && property[isActionGenerator];
    if (propIsAction) {
      continue;
    }

    const propIsReducer = property != null && property[reducerMetadata];
    if (propIsReducer) {
      extractReducer(providerClass, propertyName, actionListeners);
      continue;
    }

    const propIsSaga = property != null && property[isSaga];
    if (propIsSaga) {
      extractSaga(providerClass, propertyName, sagaList);
      continue;
    }

    // IS STATE
    extractState(providerClass, propertyName, initialState, selectDomain);
  }

  actionListeners.forEach((value, key) => {
    if (typeof key !== 'function') {
      return;
    }

    if (!key.actionType) {
      throw new TypeError(`@reducer(${key.name}): function does not have an actionType.`);
    }

    actionListeners.set(key.actionType, value);
    actionListeners.delete(key);
  });

  return {
    initialState: fromJS(initialState),
    sagaList,
    actionListeners,
  };
}

function extractReducer(providerClass: Function, propertyName: string, actionListeners: Map) {
  const property = providerClass[propertyName];
  const metadata = property[reducerMetadata];

  // replace self with action builder.
  if (metadata.self) {
    const actionType = property.actionType;

    replaceWithActionBuilder(providerClass, propertyName, actionType);
    pushToArrayMap(actionListeners, actionType, property);
  }

  if (metadata.others) {
    for (const otherActionName of metadata.others) {
      pushToArrayMap(actionListeners, otherActionName, property);
    }
  }

  return actionListeners;
}

function extractSaga(providerClass: Function, propertyName: string, sagaList: Array) {
  const property = providerClass[propertyName];

  const namespacedActionName = `${providerClass.name}::${property.name}`;
  const actionType = provider.useSymbols
    ? Symbol(namespacedActionName)
    : `@provider/${providerClass.name}/action/${propertyName}`;

  function *convertAction(action) {
    yield* property.apply(providerClass, action.payload);
  }

  function *awaitAction() {
    yield* takeLatest(actionType, convertAction);
  }

  awaitAction.actionType = actionType;
  // awaitAction[Symbols.name] = provider.useSymbols ? Symbol(namespacedActionName) : namespacedActionName;
  attemptChangeName(awaitAction, namespacedActionName);

  sagaList.push(awaitAction);

  replaceWithActionBuilder(providerClass, propertyName, actionType);
}

function replaceWithActionBuilder(providerClass, propertyName, actionType) {
  function createAction(...args) {
    return { type: actionType, payload: args };
  }

  createAction.actionType = actionType;

  if (!canRedefineValue(providerClass, propertyName)) {
    throw new TypeError(`@provider could not redefine property ${JSON.stringify(propertyName)} because it is both non-writable and non-configurable.`);
  }

  Object.defineProperty(providerClass, propertyName, {
    value: createAction,
  });
}

function extractState(providerClass, propertyName, initialState, selectDomain) {

  initialState[propertyName] = providerClass[propertyName];

  function selectProperty() {
    return createSelector(
      selectDomain(),
      subState => proxyGet(subState, propertyName),
    );
  }

  if (!Object.getOwnPropertyDescriptor(providerClass, propertyName).configurable) {
    throw new TypeError(`@provider could not redefine property ${JSON.stringify(propertyName)} because it is non-configurable.`);
  }

  // create selector
  Object.defineProperty(providerClass, propertyName, {
    get() {
      const providerState = providerClass[stateHolderSymbol];
      if (providerState === IMMUTABLE_STATE) {
        return selectProperty;
      }

      const value = providerState.get(propertyName);
      if (value != null && value.toJS) {
        const mutableValue = value.toJS();
        providerClass[mutatedProperties].set(propertyName, mutableValue);
        return mutableValue;
      }

      return value;
    },

    set(value) { // eslint-disable-line
      const immutableValue = fromJS(value);
      providerClass[stateHolderSymbol] = providerClass[stateHolderSymbol].set(propertyName, immutableValue);
    },
  });
}

function proxyGet(store, propertyName) {
  const value = store.get(propertyName);

  if (!(value instanceof Collection)) {
    // non immutable, probably a primitive, return as-is.
    return value;
  }

  const isIndexed = value instanceof Collection.Indexed;

  // proxy the collection to deny mutating in proxies.
  return new Proxy(value, {
    get(target, property) {
      if (!target.has(property) && isIndexed) {
        // return immutableJS List methods.
        if (property === 'length') {
          return target.size;
        }

        return target[property];
      }

      return proxyGet(target, property);
    },

    set(target, property) {
      throw new TypeError(`Cannot set property ${JSON.stringify(property)} on this object, it is immutable.`);
    },

    defineProperty(target, property) {
      throw new TypeError(`Cannot define property ${JSON.stringify(property)} on this object, it is immutable.`);
    },
  });
}

function pushToArrayMap(map: Map, key, value) {
  if (!map.has(key)) {
    map.set(key, value);
    return;
  }

  const previousListener = map.get(key);
  if (Array.isArray(previousListener)) {
    previousListener.push(value);
    return;
  }

  const listenerArray = [previousListener];
  listenerArray.push(value);
  map.set(key, listenerArray);
}

function attemptChangeName(obj, name) {
  if (!canRedefineValue(obj, 'name')) {
    return;
  }

  Object.defineProperty(obj, 'name', {
    value: name,
  });
}

function canRedefineValue(obj, property) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, property);
  return descriptor.configurable || descriptor.writable;
}
