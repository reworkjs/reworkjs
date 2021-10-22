

export function getLocaleBestFit(locale: string, availableLocales: string[]): ?string {

  if (availableLocales.includes(locale)) {
    return locale;
  }

  if (locale.indexOf('-') === -1) {
    return null;
  }

  const countryPart = locale.split('-')[0];
  if (availableLocales.includes(countryPart)) {
    return countryPart;
  }

  return null;
}

export function getFileName(file: string): string {
  return file.match(/^\.\/(.+)\..+$/)[1];
}

export function runBundleLoader(loader) {
  return new Promise(resolve => {
    loader(loadedModule => resolve(loadedModule));
  });
}
