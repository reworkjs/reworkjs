import { call, put } from 'redux-saga/effects';
import { provider, saga, reducer } from '../../common/decorators/provider';
import { installLocale } from '../../common/i18n';

@provider
export default class LanguageProvider {
  static locale: string = 'en';

  @saga
  static *changeLocale(newLocale) {
    const result = yield call(installLocale, newLocale);
    console.log(result);
    yield put(this._setLocale(newLocale)); // eslint-disable-line
  }

  /**
   * @private
   */
  @reducer
  static _setLocale(locale) {
    console.log('Oh oh oh');
    this.locale = locale;
  }
}
