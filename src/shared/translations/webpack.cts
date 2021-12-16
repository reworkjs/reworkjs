
// TODO: https://github.com/webpack/webpack/issues/9184

module.exports.loadMessageTranslationList = function loadMessageTranslationList() {
  // discards any file that starts with _
  // accepts files that end with .json, .js, .cjs, .mjs, .ts, .cts, .mts

  // @ts-expect-error
  return require.context('@@directories.translations', true, /(^|\/)[^_](?:[^\/\n]*)?\.(json|[cm]?[jt]s)$/, 'lazy');
}

module.exports.getListFormatLoaders = function getListFormatLoaders() {
  // p-intllist-[name]

  // @ts-expect-error
  return require.context('@formatjs/intl-listformat/locale-data', true, /\.js$/);
}

module.exports.getNumberLocaleLoaders = function getNumberLocaleLoaders() {
  // p-intlunit-[name]

  // @ts-expect-error
  return require.context('@formatjs/intl-numberformat/locale-data', true, /\.js$/);
}

module.exports.getPluralRulesLocaleLoaders = function getPluralRulesLocaleLoaders() {
  // p-pluralrules-[name]

  // @ts-expect-error
  return require.context('@formatjs/intl-pluralrules/locale-data', true, /\.js$/);
}

module.exports.getRelativeTimeLocaleLoaders = function getRelativeTimeLocaleLoaders() {
  // p-relativetimeformat-[name]

  // @ts-expect-error
  return require.context('@formatjs/intl-relativetimeformat/locale-data', true, /\.js$/);
}
