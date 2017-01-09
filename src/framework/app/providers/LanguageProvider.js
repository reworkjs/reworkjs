import { call, put } from 'redux-saga/effects';
import { save as setCookie } from 'react-cookie';
import { provider, saga, reducer } from '../../common/decorators/provider';
import { installLocale } from '../../common/i18n';

export const LOCALE_COOKIE_NAME = 'rjs-locale';

@provider
export default class LanguageProvider {
  static locale: string = 'en';

  @saga
  static *changeLocale(newLocale, persist) {
    yield call(installLocale, newLocale);
    yield put(this._setLocale(newLocale));

    if (persist) {
      setCookie(LOCALE_COOKIE_NAME, newLocale);
    }
  }

  /**
   * @private
   */
  @reducer
  static _setLocale(locale) {
    this.locale = locale;
  }
}
