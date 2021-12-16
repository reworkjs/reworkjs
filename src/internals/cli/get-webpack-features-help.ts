import type { Options } from 'yargs';
import { chalkWebpackFeature } from '../../shared/chalk.js';
import features from '../webpack/features.js';

const featureList = features.map(feature => `\t${chalkWebpackFeature(feature.prototype.getFeatureName())} - ${feature.prototype.getDescription()}`).join('\n');

const option: { [key: string]: Options } = {
  features: {
    type: 'string',
    describe: `Enable or disable (e.g.: "--feature=-sass,-postcss" disables sass and postcss support. "--feature=analyze" enables the "analyze").

\tList of features:

${featureList}

\tFeatures can be enabled or disabled by default, depending on the build environment. Use --verbose=debug to list active features.\n`,
  },
};

export default option;
