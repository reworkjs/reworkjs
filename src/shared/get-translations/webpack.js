export function loadTranslationList() {
  return require.context('bundle-loader?lazy&name=Translation-[name]!@@directories.translations', true, /\.js(on|x|m)$/);
}

export function loadLocaleList() {
  return require.context('bundle-loader?lazy&name=IntlLocale-[name]!react-intl/locale-data', true, /\.js$/);
}
