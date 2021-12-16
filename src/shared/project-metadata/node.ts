import { requireRawProject } from '../../internals/util/require-util.js';

const metadata = JSON.parse(requireRawProject('package.json'));

delete metadata.dependencies;
delete metadata.peerDependencies;
delete metadata.devDependencies;
delete metadata.scripts;

export default metadata;
