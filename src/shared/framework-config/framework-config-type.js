
export type FrameworkPluginConfig = {
  plugin: string,
  config: any,
};

export type FrameworkConfigStruct = {

  routingType: 'browser' | 'hash',

  directories: {
    logs: string,
    build: string,
    resources: string,
    translations: string,
  },

  routes: string,
  'entry-react': string | null,
  'render-html': string | null,
  'pre-init': string | null,
  'service-worker': string | null,
  'emit-integrity': boolean,

  hooks: {
    client: string | null,
    server: string | null,
  },
  plugins: { [string]: any },

  filePath: string,
};
