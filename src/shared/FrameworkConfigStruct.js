export type FrameworkConfigStruct = {
  directories: {
    logs: string,
    build: string,
    resources: string,
    routes: string,
    providers: ?string,
    translations: string,
  },

  'entry-react': string,
  'entry-html': ?string,
  'pre-init': ?string,
};
