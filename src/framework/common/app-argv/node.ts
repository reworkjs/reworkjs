import minimist from 'minimist';
import argv from '../../../internals/rjs-argv.js';

export default minimist(argv['--'] || []);
