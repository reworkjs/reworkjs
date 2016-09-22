import { requireRawRoot } from '../../src/internals/util/RequireUtil';

export default JSON.parse(requireRawRoot('package.json'));
