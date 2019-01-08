export function loadMessageTranslationList() {
  return require.context('bundle-loader?lazy&name=Translation-[name]!@@directories.translations', true, /\.js(on|x|m)$/);
}

export function loadReactIntlLocaleList() {
  return require.context('bundle-loader?lazy&name=ReactIntlLocale-[name]!react-intl/locale-data', true, /\.js$/);
}
