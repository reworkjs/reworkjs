import frameworkConfig from './framework-config';

export default function getWebpackSettings(server) {
  if (server === void 0) {
    throw new TypeError('missing param server');
  }

  return {
    output: {
      path: `${frameworkConfig.directories.build}/webpack-${server ? 'server' : 'client'}`,
      publicPath: '/',
    },
  };
}
