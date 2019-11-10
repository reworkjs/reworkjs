export default {
  ignore: [
    '.docz/**/*',
    '.idea/**/*',
    'src/shared/README.md',
    'src/framework/dummy/README.md',
    'CODE_OF_CONDUCT.md',
    'ROADMAP.md',
    'STRUCTURE.md',
    'START.md',
    'lib/**/*',
    'es/**/*',
  ],
  title: 'rework.js',
  menu: [
    'Introduction',
    'Getting Started',
    // - create a new page
    'Routing',
    // --- 404 page
    // --- completely customise routing
    // -- lazy-loading
    'CSS & Styling',
    /*
    -- @reworkjs/sass plugin
    -- @reworkjs/less plugin
    -- module types
    -- postcss config
    --- explain how it works (first postcss then scss/less/etc)
    --- drawback: @import will duplicate, use compose with isolated files. alternative does not work well at all
     */
    'Public Resources',
    'Internationalization (i18n)',
    /*
    -- how to add language
    -- default language
    -- change language through
    */
    'Server Side Rendering',
    {
      name: 'JavaScript flavors',
      menu: [
        'TypeScript',
        /*
        TODO
        -- typescript
        -- @reworkjs/typescript plugin
        -- babel-typescript plugin
        -- tsconfig (sample)
        -- lint: tsc dry run
        -- lint: lint-staged/husky (eslint, tsc)
         */

        'Flow',
        'Babel Config',
      ],
    },
    /*
    TODO
    -- load data (multi-pass)
    -- header auto-sent
    -- http/2 server push
     */
    {
      name: 'Advanced Topics',
      menu: [
        'Configuration',
        'Plugins',
        // TODO: add "flags" in configuration
        'Preact',
      ],
    },
    'API', // TODO  hooks & context
    'Command Line Interface',
  ],
};
