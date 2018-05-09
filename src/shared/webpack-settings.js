// @flow

import frameworkConfig from './framework-config';

export default function getWebpackSettings(server: boolean) {

  return {
    output: {
      path: `${frameworkConfig.directories.build}/webpack-${server ? 'server' : 'client'}`,
      publicPath: '/',
    },
  };
}
