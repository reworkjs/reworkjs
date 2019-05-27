// @flow

export type UsePersistentValueParams<T> = {
  init: () => T,
  // serialize?: T => any,
  // deserialize?: any => T,
};
