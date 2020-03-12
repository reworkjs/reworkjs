
// this file requires and installs all locales for intl-pluralrules
// as those locales are tiny, individual lazy-loading produces more code than just loading them individually
installAll(require.context('@formatjs/intl-pluralrules/dist/locale-data', true, /\.json$/));

function installAll(r) {
  for (const key of r.keys()) {
    Intl.RelativeTimeFormat.__addLocaleData(r(key));
  }
}
