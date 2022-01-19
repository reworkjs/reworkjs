export function getLocaleBestFit(locale: string, availableLocales: string[]): string | null {

  if (availableLocales.includes(locale)) {
    return locale;
  }

  if (!locale.includes('-')) {
    return null;
  }

  const countryPart = locale.split('-')[0];
  if (availableLocales.includes(countryPart)) {
    return countryPart;
  }

  return null;
}

export function getFileName(file: string): string {
  const fileName = file.match(/^\.\/(.+)\..+$/)?.[1];

  if (fileName == null) {
    throw new Error(`Could not extract fileName from ${file}`);
  }

  return fileName;
}