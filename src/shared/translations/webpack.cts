module.exports.loadMessageTranslationList = function loadMessageTranslationList() {
  // discards any file that starts with _
  // accepts files that end with .json, .js, .cjs, .mjs, .ts, .cts, .mts

  // @ts-expect-error
  return require.context('@@directories.translations', true, /(^|\/)[^_](?:[^\/\n]*)?\.(json|[cm]?[jt]s)$/, 'lazy');
}
