import { createSelector } from 'reselect';
import reducer from './reducer';

export function selectDomain() {
  return state => state.get(reducer.name);
}

export function selectLocale() {
  return createSelector(
    selectDomain(),
    languageState => languageState.get('locale')
  );
}

