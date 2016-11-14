export { default as provider } from './provider/ProviderDecorator';
export { default as reducer } from './provider/ReducerDecorator';
export { default as saga } from './provider/SagaDecorator';
export { default as action } from './provider/ActionDecorator';

export const Symbols = {
  sagas: Symbol('provider-sagas'),
  reducer: Symbol('provider-reducer'),
  name: Symbol('name'),
};

export function isProvider(item) {
  if (typeof item !== 'function') {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(item, Symbols.reducer);
}
