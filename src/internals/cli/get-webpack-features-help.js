import chalk from 'chalk';
import features from '../webpack/features';

const featureList = features.map(feature => `\t${chalk.blue(feature.prototype.getFeatureName())} - ${feature.prototype.getDescription()}`).join('\n');

export default [
  'features',
  {
    type: 'string',
    describe: `Enable or disable (e.g.: "--feature=-sass,-postcss" disables sass and postcss support. "--feature=analyze" enables the "analyze").

\tList of features:

${featureList}

\tFeatures can be enabled or disabled by default, depending on the build environment. Use --verbose=debug to list active features.\n`,
  },
];
