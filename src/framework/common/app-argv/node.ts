import minimist from 'minimist';
import argv from '../../../internals/rjs-argv';

export default minimist(argv['--'] || []);
