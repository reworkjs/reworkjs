import { requireRawRoot } from '../../internals/util/RequireUtil';

const metadata = JSON.parse(requireRawRoot('package.json'));

export default {
  name: metadata.name,
  version: metadata.version,
};
