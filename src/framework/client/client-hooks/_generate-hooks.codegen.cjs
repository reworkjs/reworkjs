// This file is run by webpack, and the code it generates is the one that will actually be used

//  see "HACK: (.codegen.cjs)" in webpack config
module.exports = async function getClientHooks() {
  const { getHooks, HOOK_SIDES } = await import('../../../internals/get-plugins.js');

  const hookFiles = getHooks(HOOK_SIDES.client);

  return {
    code: `
    ${hookFiles.map((file, i) => `import importedValue${i} from ${JSON.stringify(file)};\n`).join('')}
    
    export default [
      ${hookFiles.map((_hookFile, i) => `importedValue${i},`).join('')}
    ];
    `,
  };
};
