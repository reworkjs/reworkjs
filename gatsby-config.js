const { mergeWith } = require('lodash/fp')

let custom
try {
  custom = require('./gatsby-config.custom')
} catch (err) {
  custom = {}
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Core',
    description: 'A react framework that works out of the box',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        docgenConfig: {},
        menu: [
          'Getting Started',
          { name: 'Components', menu: ['Alert', 'Button'] },
        ],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz',
        base: '/',
        source: './',
        src: './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Core',
        description: 'A react framework that works out of the box',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/ephys/Documents/dev/reworkjs/reworkjs',
          templates:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/node_modules/docz-core/dist/templates',
          docz: '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz',
          cache: '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/.cache',
          app: '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/app',
          appPackageJson:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/package.json',
          gatsbyConfig:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/gatsby-config.js',
          gatsbyBrowser:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/gatsby-browser.js',
          gatsbyNode:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/gatsby-node.js',
          gatsbySSR:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/gatsby-ssr.js',
          importsJs:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/app/imports.js',
          rootJs:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/app/root.jsx',
          indexJs:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/app/index.jsx',
          indexHtml:
            '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/app/index.html',
          db: '/Users/ephys/Documents/dev/reworkjs/reworkjs/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
