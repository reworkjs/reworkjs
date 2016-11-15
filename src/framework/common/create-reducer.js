/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 */
import { combineReducers } from 'redux-immutable';
import { Symbols } from './decorators/provider';
import providers, { Provider } from './providers';

export default function createReducer(asyncReducers) {
  const reducers = Object.assign({}, asyncReducers);

  for (const provider: Provider of providers) {

    const reducer = provider[Symbols.reducer] || provider.reducer;
    if (!reducer) {
      continue;
    }

    if (typeof reducer !== 'function') {
      throw new Error('One of your providers exported a reducer that is not a function');
    }

    const name = reducer[Symbols.name] || reducer.name;
    if (!name) {
      throw new Error('One of your providers exported a nameless reducer, please name it');
    }

    reducers[name] = reducer;
  }

  return combineReducers(reducers);
}