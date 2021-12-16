import { requireRawRoot } from '../../internals/util/require-util.js';

const metadata = JSON.parse(requireRawRoot('package.json'));

export default {
  name: metadata.name,
  version: metadata.version,
};
