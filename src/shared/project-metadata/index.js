import { requireRawProject } from '../../internals/util/RequireUtil';

const metadata = JSON.parse(requireRawProject('package.json'));

delete metadata.dependencies;
delete metadata.peerDependencies;
delete metadata.devDependencies;
delete metadata.scripts;

export default metadata;
