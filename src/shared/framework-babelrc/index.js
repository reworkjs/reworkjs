import { requireRawRoot } from '../../internals/util/RequireUtil';

export default JSON.parse(requireRawRoot('.babelrc.webpack'));
