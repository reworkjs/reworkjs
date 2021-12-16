export function loadMessageTranslationList() {
  // @ts-expect-error
  return require.context('bundle-loader?lazy&name=Translation-[name]!@@directories.translations', true, /\.js(on|x|m)$/);
}
