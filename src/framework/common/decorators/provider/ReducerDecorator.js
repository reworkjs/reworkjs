import ProviderDecorator from './ProviderDecorator';

export const reducerMetadata = Symbol('is-reducer');

function getReducerMetadata(descriptor) {
  const value = descriptor.value;
  const reducerData = value[reducerMetadata] || {};
  value[reducerMetadata] = reducerData;

  return reducerData;
}

function selfReducer(target, key, descriptor) {
  if (!descriptor) {
    return selfReducer;
  }

  const metadata = getReducerMetadata(descriptor);
  metadata.self = true;

  descriptor.value.actionType = ProviderDecorator.useSymbols
        ? Symbol(`${key}Action`)
        : `@provider/${target.listName}/action/${key}`;

  return descriptor;
}

export default function reducer(actionType, a1, a2) {
  if (actionType === void 0) {
    return reducer;
  }

  if (actionType == null) {
    throw new TypeError('@reducer(null): null is not a valid parameter.');
  }

  if (a2) {
    return selfReducer(actionType, a1, a2);
  }

  return function applyReducerDecorator(target, ignored, descriptor) {
    const metadata = getReducerMetadata(descriptor);
    metadata.others = metadata.others || new Set();
    metadata.others.add(actionType);

    return descriptor;
  };
}
