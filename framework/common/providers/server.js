/**
 * Exports the list of providers based on the setup config.
 *
 * Using node.
 */
import fs from 'fs';
import requireAll from 'require-all';
import frameworkConfig from '../../server/framework-config';
import { resolveRoot } from '../../util/RequireUtil';

const localProviders = requireAll({
  dirname: resolveRoot('framework/app/providers'),
  filter: /\.js$/,
});

try {
  if (fs.statSync(frameworkConfig.directories.providers).isDirectory()) {
    localProviders.push(...requireAll({
      dirname: frameworkConfig.directories.providers,
      filter: /\.js$/,
    }));
  } else {
    console.warn('Provider directory is not a directory.');
  }
} catch (ignored) {
  // ignored
}

export default localProviders;
