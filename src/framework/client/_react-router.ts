// this module is ran on node before webpack bundles it.
import config from '@reworkjs/core/_internal_/framework-config';

export default function getRouteDeclarations() {

  const isHash = config.default.routingType === 'hash';

  return {
    code: `export const isHash = ${isHash}`,
  };
}
