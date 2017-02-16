// @flow

// TODO check selectors are optimised correctly https://github.com/reactjs/reselect#createselectorinputselectors--inputselectors-resultfunc

import { fromJS, Collection, is as immutableIs } from 'immutable';
import { takeLatest } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import constantCase from 'constant-case';
import { attemptChangeName, killMethod, replaceMethod } from '../../../util/util';
import logger from '../../../../shared/logger';
import { Symbols } from '../provider';
import { classDecorator, ClassDecoratorArgument } from '../decorator';
import { TYPE_REDUCER } from './ReducerDecorator';
import { TYPE_SAGA } from './SagaDecorator';
import { TYPE_ACTION_GENERATOR } from './ActionDecorator';
import { propertyType, TYPE_STATE, getPropertyMetadata } from './_util';

export type ActionListenerMap = Map<string, Array<Function>>;
type DataBag = {
  ProviderClass: Function,
  sagaList: GeneratorFunction[],
  actionListeners: ActionListenerMap,
  addActionListener: (actionType: string, actionHandler: Function) => void,
  initialState: Object,
  selectDomain: Function,
};

const PROVIDER_STATE_ACCESSOR = Symbol('state-holder');
const mutatedProperties = Symbol('mutatedProperties');
const mutableVersion = Symbol('mutable-version');

// Blacklist universal properties, Function static properties and @provider symbols.
const PROPERTY_BLACKLIST = Object.getOwnPropertyNames(Object.prototype)
// use function() {} instead of Function because Function does not have the "caller" nor "arguments" properties on
// Safari < 11
  .concat(Object.getOwnPropertyNames(() => {
  }));

function denyAccess() {
  throw new Error('Cannot access @provider state outside of @reducer annotated methods. If you are trying to r/w the state from a @saga, you will need to use "yield put(this.<reducerMethodName>())"');
}

const IMMUTABLE_STATE = {
  set: denyAccess,
  get: denyAccess,
};

const registeredProviders = [];

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
const ProviderDecorator = classDecorator((arg: ClassDecoratorArgument) => {
  if (arg.options.length > 0) {
    throw new TypeError('@provider does not accept options.');
  }

  const providerClass = arg.target;

  if (registeredProviders.includes(providerClass.name)) {
    throw new Error(`A provider has already been registered under the name ${providerClass.name}. Please make sure all provider classes have unique names.`);
  }

  registeredProviders.push(providerClass.name);
  if (Object.getOwnPropertyNames(providerClass.prototype).length > 1) {
    logger.warn(`@provider ${providerClass.name} has instance properties. This is likely a bug as providers are fully static.`);
  }

  const domainIdentifier = `RJS-${providerClass.name}`;

  function selectDomain() {
    return state => {
      const domain = state.get(domainIdentifier);

      if (domain === void 0) {
        throw new Error(`Could not retrieve the store subdomain ${JSON.stringify(domainIdentifier)}. Either the associated reducer is not loaded or it is loaded under a different name.`);
      }

      return domain;
    };
  }

  providerClass[PROVIDER_STATE_ACCESSOR] = IMMUTABLE_STATE;

  const { initialState, sagaList, actionListeners } = extractFromProvider(providerClass, selectDomain);

  function genericReducer(state = initialState, actionData) {
    const type = actionData.type;

    const actionHandler = actionListeners.get(type);
    if (!actionHandler) {
      return state;
    }

    return state.withMutations(map => {
      providerClass[PROVIDER_STATE_ACCESSOR] = map;
      const mutatedObjectMap = new Map();
      providerClass[mutatedProperties] = mutatedObjectMap;

      for (const actionHandlerItem of actionHandler) {
        if (Array.isArray(actionData.payload)) {
          actionHandlerItem.apply(providerClass, actionData.payload);
        } else {
          actionHandlerItem.call(providerClass, actionData.payload);
        }
      }

      mutatedObjectMap.forEach((value, key) => {
        const newVal = fromJS(value);
        const oldVal = map.get(key);

        if (!immutableIs(newVal, oldVal)) {
          map.set(key, newVal);
        }
      });

      providerClass[PROVIDER_STATE_ACCESSOR] = IMMUTABLE_STATE;
      providerClass[mutatedProperties] = IMMUTABLE_STATE;
    });
  }

  genericReducer[Symbols.name] = domainIdentifier;
  attemptChangeName(genericReducer, `${providerClass.name}@reducer`);

  providerClass[Symbols.reducer] = genericReducer;
  providerClass[Symbols.sagas] = sagaList;

  return providerClass;
});

ProviderDecorator.select = function select(property, store) {
  if (!store) {
    throw new TypeError('Expected store (not state) as second parameter.');
  }

  if (typeof property !== 'function' || !property.recomputations) {
    throw new TypeError('The property you passed to Provider.select is not selectable.');
  }

  return property(store.getState());
};

export default ProviderDecorator;

function extractFromProvider(ProviderClass, selectDomain) {
  const actionListeners: ActionListenerMap = new Map();
  const sagaList = [];
  const initialState = {};

  const dataBag: DataBag = {
    ProviderClass,
    sagaList,
    actionListeners,
    initialState,
    selectDomain,
    addActionListener(actionType, actionListener) {
      if (!actionListeners.has(actionType)) {
        actionListeners.set(actionType, []);
      }

      actionListeners.get(actionType).push(actionListener);
    },
  };

  const keys = Object.getOwnPropertyNames(ProviderClass);

  for (const propertyName of keys) {
    if (PROPERTY_BLACKLIST.includes(propertyName)) {
      continue;
    }

    const property = ProviderClass[propertyName];
    const type = property == null ? null : property[propertyType];

    switch (type) {
      case TYPE_ACTION_GENERATOR:
        continue;

      case TYPE_REDUCER:
        extractReducer(propertyName, dataBag);
        continue;

      case TYPE_SAGA:
        extractSaga(propertyName, dataBag);
        continue;

      case TYPE_STATE:
      default:
        extractState(propertyName, dataBag);
    }
  }

  dataBag.initialState = fromJS(initialState);
  return dataBag;
}

function installActionBuilder(providerClass, propertyName) {
  const method = providerClass[propertyName];
  const metadata = getPropertyMetadata(method);

  if (!metadata.actionType) {
    return killMethod(providerClass, propertyName);
  }

  function createAction(...args) {
    return { type: metadata.actionType, payload: args };
  }

  createAction.actionType = metadata.actionType;

  replaceMethod(providerClass, propertyName, createAction);

  return createAction;
}

function extractReducer(propertyName: string, dataBag: DataBag) {
  const { ProviderClass, addActionListener } = dataBag;

  const actionListener = ProviderClass[propertyName];
  const metadata = getPropertyMetadata(actionListener);

  for (const actionType of metadata.listenedActionTypes) {
    addActionListener(actionType, actionListener);
  }

  installActionBuilder(ProviderClass, propertyName);
}

function extractSaga(propertyName: string, dataBag: DataBag) {
  const { ProviderClass, sagaList } = dataBag;

  const property = ProviderClass[propertyName];
  const metadata = getPropertyMetadata(property);

  let callActionHandler;
  const actionBuilder = installActionBuilder(ProviderClass, propertyName);

  if (metadata.trackStatus) {
    const { initialState, addActionListener } = dataBag;

    const trackActionType = `@@provider/${constantCase(ProviderClass.name)}/setRunning/${constantCase(propertyName)}`;
    callActionHandler = function *callActionHandlerWithTracking(action) {
      yield put({ type: trackActionType, payload: true });
      yield* property.apply(ProviderClass, action.payload);
      yield put({ type: trackActionType, payload: false });
    };

    const runningPropertyName = `${propertyName}.running`;
    installSelector(runningPropertyName, dataBag);
    initialState[runningPropertyName] = false;

    Object.defineProperty(actionBuilder, 'running', Object.getOwnPropertyDescriptor(ProviderClass, runningPropertyName));

    addActionListener(trackActionType, function changeRunningStatus(runningStatus) {
      this[runningPropertyName] = runningStatus; // eslint-disable-line
    });
  } else {
    callActionHandler = function *callActionHandlerWithoutTracking(action) {
      yield* property.apply(ProviderClass, action.payload);
    };
  }

  function *awaitAction() {
    yield* takeLatest(metadata.actionType, callActionHandler);
  }

  attemptChangeName(awaitAction, `${ProviderClass.name}.${property.name}`);
  sagaList.push(awaitAction);
}

function extractState(propertyName: string, dataBag: DataBag) {
  const { ProviderClass, initialState } = dataBag;

  initialState[propertyName] = ProviderClass[propertyName];

  if (!Object.getOwnPropertyDescriptor(ProviderClass, propertyName).configurable) {
    throw new TypeError(`@provider could not redefine property ${JSON.stringify(propertyName)} because it is non-configurable.`);
  }

  installSelector(propertyName, dataBag);
}

function installSelector(propertyName: string, dataBag: DataBag) {
  const { ProviderClass, selectDomain } = dataBag;

  const selectProperty = createSelector(
    selectDomain(),
    subState => proxyGet(subState, propertyName),
  );

  attemptChangeName(selectProperty, `select_${propertyName}`);

  // create selector
  Object.defineProperty(ProviderClass, propertyName, {
    get() {
      const providerState = ProviderClass[PROVIDER_STATE_ACCESSOR];

      // no reducer active, return a selector.
      if (providerState === IMMUTABLE_STATE) {
        return selectProperty;
      }

      if (ProviderClass[mutatedProperties].has(propertyName)) {
        return ProviderClass[mutatedProperties].get(propertyName);
      }

      const value = providerState.get(propertyName);
      if (value == null || !value.toJS) {
        return value;
      }

      const mutableValue = value.toJS();
      ProviderClass[mutatedProperties].set(propertyName, mutableValue);

      return mutableValue;
    },

    set(value) {
      ProviderClass[mutatedProperties].set(propertyName, value);
    },
  });
}

function definePropertyTrap(target, property) {
  throw new TypeError(`Cannot define property ${JSON.stringify(property)} on this object, it is immutable.`);
}

function setTrap(target, property, value) {
  if (typeof property === 'symbol') {
    target[property] = value;
    return true;
  }

  throw new TypeError(`Cannot set property ${JSON.stringify(property)} on this object, it is immutable.`);
}

const proxied = Symbol('proxied');

/* eslint-disable no-invalid-this */
function useArrayMethodOnImmutableList(methodName) {

  function methodProxy(...args) {
    if (this == null) {
      throw new TypeError('`this` cannot be null / undefined.');
    }

    const target = this[proxied] ? this[proxied] : this;

    let self;
    if (target[mutableVersion]) {
      self = target[mutableVersion];
    } else if (target instanceof Collection.Indexed) {
      self = target.toJS();
      target[mutableVersion] = self;
    } else if (Array.isArray(target)) {
      self = target;
    } else {
      throw new TypeError('Expected `this` to be a list or array.');
    }

    return Array.prototype[methodName].apply(self, args);
  }

  attemptChangeName(methodProxy, methodName);

  return methodProxy;
}
/* eslint-enable */
const proxyCache = new WeakMap();

function proxyGet(store, propertyName) {
  const value = store.get(propertyName);

  if (!(value instanceof Collection)) {
    // non immutable, probably a primitive, return as-is.
    return value;
  }

  if (typeof Proxy === 'undefined') {
    return value.toJS();
  }

  const cachedProxy = proxyCache.get(value);
  if (cachedProxy) {
    return cachedProxy;
  }

  const isIndexed = value instanceof Collection.Indexed;

  const traps = {
    get(target, property) {
      if (typeof property === 'symbol') {
        return target[property];
      }

      if (!target.has(property) && isIndexed) {
        // return immutableJS List methods.
        if (property === 'length') {
          return target.size;
        }

        return useArrayMethodOnImmutableList(property);
      }

      return proxyGet(target, property);
    },

    set: setTrap,
    defineProperty: definePropertyTrap,
  };

  const proxy = new Proxy(value, traps);
  proxy[proxied] = value;

  proxyCache.set(value, proxy);

  return proxy;
}
