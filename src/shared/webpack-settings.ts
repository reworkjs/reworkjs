import frameworkConfig from '@reworkjs/core/_internal_/framework-config';

export default function getWebpackSettings(server: boolean) {

  return {
    output: {
      path: `${frameworkConfig.directories.build}/${server ? 'server' : 'client'}`,
      publicPath: '/',
    },
  };
}
