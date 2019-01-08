// @flow

import global from 'global';

const _hasNativeIntl = Boolean(global.Intl);

export function hasNativeIntl(): boolean {
  return _hasNativeIntl;
}

export function installIntlPolyfill(): Promise<void> {
  if (hasNativeIntl()) {
    return Promise.resolve();
  }

  return import(/* webpackChunkName: "rjs-intl" */ 'intl');
}
