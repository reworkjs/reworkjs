// this module is ran on node before webpack bundles it.

// commonjs because of https://github.com/webpack-contrib/val-loader/issues/80
module.exports = async function getRouteDeclarations() {
  const config = await import('@reworkjs/core/_internal_/framework-config');

  const serviceWorkerEntry = config.default['service-worker'];
  if (!serviceWorkerEntry) {
    return { code: `` };
  }

  return {
    code: `import ${JSON.stringify(serviceWorkerEntry)};`,
  };
}
