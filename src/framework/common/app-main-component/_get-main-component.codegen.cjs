// this module is ran on node before webpack bundles it.

const DEFAULT_ENTRY = `
import { Fragment } from 'react';
export default Fragment;
`;

//  see "HACK: (.codegen.cjs)" in webpack config
module.exports = async function getRouteDeclarations() {
  const ConfigModule = await import('@reworkjs/core/_internal_/framework-config');

  const entryConfig = ConfigModule.default['entry-react'];
  if (!entryConfig) {
    return { code: DEFAULT_ENTRY };
  }

  return {
    code: `
      export { default } from ${JSON.stringify(entryConfig)};
    `,
  };
}
