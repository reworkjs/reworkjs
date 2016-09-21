/**
 * Exports the list of routes based on the setup config.
 *
 * Using node.
 */
import requireAll from 'require-all';
import frameworkConfig from '../../server/framework-config';

// require('/Users/ephys/Documents/dev/tmp/framework-test/app/services/sdk.js');

export default requireAll({
  dirname: frameworkConfig.directories.routes,
  filter: /\.js$/,
});
