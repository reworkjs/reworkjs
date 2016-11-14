import { requireRawProject } from '../../internals/util/RequireUtil';

export default JSON.parse(requireRawProject('package.json'));
