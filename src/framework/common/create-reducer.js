/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 */
import { combineReducers } from 'redux-immutable';
import providers from './providers';
import { Provider } from './providers';

export default function createReducer(asyncReducers) {
  const reducers = Object.assign({}, asyncReducers);

  for (const provider: Provider of providers) {
    const reducer = provider.reducer;
    if (!reducer) {
      continue;
    }

    if (typeof reducer !== 'function') {
      throw new Error('One of your providers exported a reducer that is not a function');
    }

    if (!reducer.name) {
      throw new Error('One of your providers exported a nameless reducer, please name it');
    }

    reducers[reducer.name] = reducer;
  }

  return combineReducers(reducers);
}
