let locales = null;

export function setRequestLocales(newLocales) {
  locales = newLocales;
  Object.freeze(locales);
}

export function getCurrentRequestLocales() {
  return locales;
}
