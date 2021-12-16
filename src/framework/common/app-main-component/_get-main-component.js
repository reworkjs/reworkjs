
// this module is ran on node before webpack bundles it.
import config from '@reworkjs/core/_internal_/framework-config';

const DEFAULT_ENTRY = `
import { Fragment } from 'react';
export default Fragment;
`;

export default function getRouteDeclarations() {

  const entryConfig = config.default['entry-react'];
  if (!entryConfig) {
    return { code: DEFAULT_ENTRY };
  }

  return {
    code: `
      export { default } from ${JSON.stringify(entryConfig)};
    `,
  };
}
