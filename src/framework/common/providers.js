/**
 * Exports the list of providers based on the setup config.
 *
 * Using webpack.
 */

import requireAll from '../util/require-all';
import { isProvider } from './decorators/provider';

export type Provider = {
  reducer: ?Function,
  sagas: ?Function[],
};

const providers: Provider[] = requireAll(
  require.context('@@directories.providers', true, /\.jsx?$/),
  require.context('../app/providers', true, /\.jsx?$/),
).filter(selectProvider);

function selectProvider(item) {
  if (item == null) {
    return false;
  }

  if (isProvider(item)) {
    return true;
  }

  if (typeof item === 'object') {
    return Object.prototype.hasOwnProperty.call(item, 'reducer') || Object.prototype.hasOwnProperty.call(item, 'sagas');
  }

  return false;
}

export default providers;
