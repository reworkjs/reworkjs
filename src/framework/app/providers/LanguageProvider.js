import { call, put } from 'redux-saga/effects';
import { provider, saga, reducer } from '../../common/decorators/provider';
import { installLocale } from '../../common/i18n';

@provider
export default class LanguageProvider {
  static locale: string = 'en';

  @saga
  static *changeLocale(newLocale) {
    yield call(installLocale, newLocale);
    yield put(this._setLocale(newLocale)); // eslint-disable-line
  }

  /**
   * @private
   */
  @reducer
  static _setLocale(locale) {
    this.locale = locale;
  }
}
