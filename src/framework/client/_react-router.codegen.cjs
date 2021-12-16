// this module is ran on node before webpack bundles it.

//  see "HACK: (.codegen.cjs)" in webpack config
module.exports = async function getRouteDeclarations() {
  const config = (await import('@reworkjs/core/_internal_/framework-config')).default;

  const isHash = config.routingType === 'hash';

  return {
    code: `export const isHash = ${isHash};`,
  };
};
