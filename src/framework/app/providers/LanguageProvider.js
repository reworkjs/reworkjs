import { call, put } from 'redux-saga/effects';
import { provider, saga, reducer } from '../../common/decorators/provider';
import { storePreferredLocale } from '../../common/get-preferred-locale';
import { installLocale } from '../../common/i18n';

@provider('i18n')
export default class LanguageProvider {
  static locale: string = 'en';

  @saga
  static *changeLocale(newLocale, cookie) {
    yield call(installLocale, newLocale);
    yield put(this._setLocale(newLocale));

    storePreferredLocale(cookie, newLocale);
  }

  /**
   * @private
   */
  @reducer
  static _setLocale(locale) {
    this.locale = locale;
  }
}
