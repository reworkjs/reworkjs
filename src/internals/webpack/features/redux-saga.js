import BaseFeature from '../BaseFeature';

export default class ReduxSagaFeature extends BaseFeature {

  getFeatureName() {
    return 'redux-saga';
  }

  getDescription() {
    return 'Optimizes redux-saga. See https://github.com/redux-saga/redux-saga/issues/894';
  }

  visit(webpack) {
    webpack.injectAlias('redux-saga/lib', 'redux-saga/es');
    webpack.injectAlias('redux-saga', 'redux-saga/es');
  }
}
