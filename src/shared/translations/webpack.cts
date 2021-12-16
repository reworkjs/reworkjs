module.exports.loadMessageTranslationList = function loadMessageTranslationList() {
  // @ts-expect-error
  return require.context('@@directories.translations', true, /\.js(on|x|m)$/, 'lazy');
}
