import { provider } from '../../common/decorators/provider';

@provider
export default class LanguageProvider {
  static locale: string = 'en';

  static *changeLocale(newLocale) {
    console.log(newLocale);
  }

  static _setLocale(locale) {
    this.locale = locale;
  }
}

/*
 function getStartLocale() {
 if (typeof navigator === 'undefined') {
 return 'en';
 }

 if (navigator.languages) {
 for (const language of navigator.languages) {
 if (isLocaleValid(language)) {
 return language;
 }
 }
 }

 if (isLocaleValid(navigator.language)) {
 return navigator.language;
 }

 return 'en';
 }
 */
