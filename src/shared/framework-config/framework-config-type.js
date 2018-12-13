
export type FrameworkPluginConfig = {
  plugin: string,
  config: any,
};

export type FrameworkConfigStruct = {
  directories: {
    logs: string,
    build: string,
    resources: string,
    translations: string,
  },

  routes: string,
  'entry-react': string,
  'render-html': ?string,
  'pre-init': ?string,
  'service-worker': ?string,

  plugins: ?{ [string]: any },
};
