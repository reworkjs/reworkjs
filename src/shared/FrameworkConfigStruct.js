export type FrameworkConfigStruct = {
  directories: {
    build: string,
    resources: string,
    routes: string,
    providers: ?string,
    translations: string,
  },

  'entry-react': string,
  'entry-html': ?string,
  'pre-init': ?string,

  webpack: ?string,
  dlls: string[],
};
