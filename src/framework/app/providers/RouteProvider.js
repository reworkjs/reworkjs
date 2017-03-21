import { LOCATION_CHANGE } from 'react-router-redux';
import { provider, reducer } from '../../common/decorators/provider';

@provider('react-router')
export default class LanguageProvider {
  static locationBeforeTransitions = null;

  /**
   * @private
   */
  @reducer(LOCATION_CHANGE)
  static onLocationChange(payload) {
    this.locationBeforeTransitions = payload;
  }
}
