import { call, put } from 'redux-saga/effects';
import { provider, saga, reducer } from '../../common/decorators/provider';
import { installLocale } from '../../common/i18n';

export const LOCALE_COOKIE_NAME = 'rjs-locale';

@provider('i18n')
export default class LanguageProvider {
  static locale: string = 'en';

  @saga
  static *changeLocale(newLocale, cookie) {
    yield call(installLocale, newLocale);
    yield put(this._setLocale(newLocale));

    if (cookie && cookie.get(LOCALE_COOKIE_NAME) !== newLocale) {
      cookie.set(LOCALE_COOKIE_NAME, newLocale, { path: '/' });
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
