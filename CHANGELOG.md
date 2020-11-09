# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.33.3](https://github.com/reworkjs/reworkjs/compare/v0.33.2...v0.33.3) (2020-11-09)


### Features

* add option to disable subresource integrity ([5b74257](https://github.com/reworkjs/reworkjs/commit/5b74257ec1e192d89b20cc408b9195e755988ca4))

### [0.33.2](https://github.com/reworkjs/reworkjs/compare/v0.33.1...v0.33.2) (2020-08-31)


### ⚠ BREAKING CHANGES

* server-side rendering requires node 12+

### Features

* html - add integrity hashes in production ([adaea1e](https://github.com/reworkjs/reworkjs/commit/adaea1e04f70842c97e41fa5c5144cede95931cf))
* rjs init - print message hinting at next step ([1d4faa7](https://github.com/reworkjs/reworkjs/commit/1d4faa7075bcbaab101c1269b099af13cf5f42bc))
* update default lintstaged to include ts & remove git add ([784eec8](https://github.com/reworkjs/reworkjs/commit/784eec8212269b97d025504472c0289b7c9ca6da))
* update intl polyfills ([2229ac7](https://github.com/reworkjs/reworkjs/commit/2229ac7599c38eb96a4ae0031136a17a6e6636e3))


### Bug Fixes

* fix how intl polyfills are imported ([33ac3cb](https://github.com/reworkjs/reworkjs/commit/33ac3cb175d902f5b7080ef41a8a1ba735122c2a))
* send error page if initial build failed instead of crashing ([da6af5b](https://github.com/reworkjs/reworkjs/commit/da6af5b2c0e410ad6ba1a3391054186eff2db1ba))


* update hapi/accept ([c8410a3](https://github.com/reworkjs/reworkjs/commit/c8410a374da502c1a722fcb4f80b222130d915d1))

### [0.33.1](https://github.com/reworkjs/reworkjs/compare/v0.33.0...v0.33.1) (2020-08-05)


### Features

* replace react-hot with react-refresh 🎉 ([b2f1b5f](https://github.com/reworkjs/reworkjs/commit/b2f1b5f2897bf43b82910f880b90669ab4f94bc5))

## [0.33.0](https://github.com/reworkjs/reworkjs/compare/v0.32.2...v0.33.0) (2020-07-16)


### ⚠ BREAKING CHANGES

* sass is now using dart-sass

### Features

* update dependencies ([171a5c0](https://github.com/reworkjs/reworkjs/commit/171a5c05e9935236507a6b767e002858862d63c1))


### Bug Fixes

* install sass instead of dart-sass ([4eb97ab](https://github.com/reworkjs/reworkjs/commit/4eb97ab6ad6751493d4a964a422652f6de37fa30))

### [0.32.2](https://github.com/reworkjs/reworkjs/compare/v0.32.1...v0.32.2) (2020-04-23)


### Bug Fixes

* fix intl-plural-rules polyfill not loading locales ([446177b](https://github.com/reworkjs/reworkjs/commit/446177b53dd1e52bd8b3ad931f9fc62caa047ac3))

### [0.32.1](https://github.com/reworkjs/reworkjs/compare/v0.32.0...v0.32.1) (2020-04-23)


### Bug Fixes

* make globalThis ponyfill work in safari ([f3f6854](https://github.com/reworkjs/reworkjs/commit/f3f685442817b3ec4d89d8d7498d98a5883382ab))

## [0.32.0](https://github.com/reworkjs/reworkjs/compare/v0.31.1...v0.32.0) (2020-04-15)


### ⚠ BREAKING CHANGES

* react-intl has been upgraded to v4, you might have to update your messages

### Features

* add dev 404 route ([a07a742](https://github.com/reworkjs/reworkjs/commit/a07a742eef0a8aacdbdb4b6b852c222e1bd10084))
* include wrapped comp name in withContext name ([91e2e13](https://github.com/reworkjs/reworkjs/commit/91e2e1304cade4116863c799f6aaef17f58737d9))
* load ts route files by default ([ada189f](https://github.com/reworkjs/reworkjs/commit/ada189fbb6724be7ef1963a73b8ae08ed45cb6e5))


### Bug Fixes

* fix how dev 404 route is loaded ([1457794](https://github.com/reworkjs/reworkjs/commit/14577946991cced69e115fb946b451d9d8b9a8ce))


* update dependencies ([d8ed1aa](https://github.com/reworkjs/reworkjs/commit/d8ed1aaf5837d670205efc6f2de577c9a0bd08e9))

### [0.31.1](https://github.com/reworkjs/reworkjs/compare/v0.31.0...v0.31.1) (2020-03-18)


### Features

* css classes are now minified instead of hashed in production ([b82c9c4](https://github.com/reworkjs/reworkjs/commit/b82c9c4e672c634dc16edd55388ace6ba7728ef1))

## [0.31.0](https://github.com/reworkjs/reworkjs/compare/v0.30.0...v0.31.0) (2020-03-12)


### ⚠ BREAKING CHANGES

* Framework now requires a minimum of Safari 10.3, as the base "Intl" object is no longer polyfilled

### Features

* drop `Intl` polyfill, polyfill ListFormat & Unit Number Format ([344742e](https://github.com/reworkjs/reworkjs/commit/344742e8a8e04332ab0f8d30cb7cbc1134d0b360))

## [0.30.0](https://github.com/reworkjs/reworkjs/compare/v0.29.5...v0.30.0) (2020-02-19)


### Features

* replace HashHistory with BrowserHistory with hash prefix ([7be8b00](https://github.com/reworkjs/reworkjs/commit/7be8b00cd2401fec005c015c82d8687d5e7bcf00))


### Bug Fixes

* attempt correcting location in hash routing ([3c8e766](https://github.com/reworkjs/reworkjs/commit/3c8e7662792fff66e869591e21c8bccaec9715fb))
* hash - fix hash router breaking if there is a search query ([41ad219](https://github.com/reworkjs/reworkjs/commit/41ad219656e9173d22dc56856b61b11464c7a97c))
* hash routing - clean url through `history` ([e35a9a6](https://github.com/reworkjs/reworkjs/commit/e35a9a67e26c47ed20bbf67f39d645860c4e2277))

### [0.29.5](https://github.com/reworkjs/reworkjs/compare/v0.29.4...v0.29.5) (2020-02-10)


### Features

* replace style-loader with extract-css-plugin in development ([6009bcd](https://github.com/reworkjs/reworkjs/commit/6009bcd24288b94b2d730ef99e5a86946cbdb6bc))

### [0.29.4](https://github.com/foobarhq/reworkjs/compare/v0.29.3...v0.29.4) (2020-01-20)


### Features

* expose API to know if a new SW has been installed ([c5b47c5](https://github.com/foobarhq/reworkjs/commit/c5b47c549694680d3885e681ba60eb746749425f))

### [0.29.3](https://github.com/foobarhq/reworkjs/compare/v0.29.2...v0.29.3) (2019-12-03)


### Bug Fixes

* properly dispatch service-worker lifecycle events ([8a91712](https://github.com/foobarhq/reworkjs/commit/8a9171265a258fb6f1d9317e42031f063fcbe9bc))
* replace intl-pluralrules with formatjs as the former is buggy ([dae6b40](https://github.com/foobarhq/reworkjs/commit/dae6b406adcb3e12199b06791bd6c29b18d947ff))

### [0.29.2](https://github.com/foobarhq/reworkjs/compare/v0.29.1...v0.29.2) (2019-11-20)


### Bug Fixes

* fix helmet data being discarded in ssr ([906a4dc](https://github.com/foobarhq/reworkjs/commit/906a4dc3eac48754e4796acc8495ad12dd852191))

### [0.29.1](https://github.com/foobarhq/reworkjs/compare/v0.29.0...v0.29.1) (2019-11-20)


### Features

* add new getPluginInstance API ([22db85e](https://github.com/foobarhq/reworkjs/commit/22db85e33a1c557f1a17a4857e9bd59db0633d97))
* expose service worker events ([28ad2fd](https://github.com/foobarhq/reworkjs/commit/28ad2fd9342db7f482bb5ae6067ea0d360bba5d7))
* reduce logging spam, add webpackbar ([b697d12](https://github.com/foobarhq/reworkjs/commit/b697d12a9b064c71678d7da2ce1458a4f5fe1c7c))
* replace react-helmet with react-helmet-async ([161bee1](https://github.com/foobarhq/reworkjs/commit/161bee12c7fe8203c6c751b9dd9c9b75c8f4218a))
* update react-hot-loader ([9839f2e](https://github.com/foobarhq/reworkjs/commit/9839f2e200964e6fefa3aeb059a151c2fdd5b8a3))

## [0.29.0](https://github.com/foobarhq/reworkjs/compare/v0.28.1...v0.29.0) (2019-11-16)


### ⚠ BREAKING CHANGES

* usage of `--prerendering` flag must be changed to `--ssr`
* you will now need either move the files to a subfolder or adapt references to public resources

### Features

* allow js webpack type to be extended by plugins ([6af9698](https://github.com/foobarhq/reworkjs/commit/6af969838bc381981365f27f89e7f4f52e928def))
* always purge unused react-intl polyfills & add relativetime ([9c226bc](https://github.com/foobarhq/reworkjs/commit/9c226bc93060580d3d0fa5eb415a9fc529b29855))
* copy files from resource directory to root of dist ([6cab5b7](https://github.com/foobarhq/reworkjs/commit/6cab5b75d629fe792fb063877dc089924182557f))
* default lint-staged now autofixes ([d0fd508](https://github.com/foobarhq/reworkjs/commit/d0fd5087cfa779a6065f31753087f41b72948312))
* expose APIs to access react-router context & set http status ([f154214](https://github.com/foobarhq/reworkjs/commit/f1542145bb85eaad1ba7eb33da026a05bb671bd0))
* parse typescript as javascript files ([78ef8b9](https://github.com/foobarhq/reworkjs/commit/78ef8b99811233e3b0ca820720e1d20e6d4a274e))
* rename prerendering -> ssr ([7ead843](https://github.com/foobarhq/reworkjs/commit/7ead843d02297f495885484d8ee4b016e4752b31))


### Bug Fixes

* accept extra args in build ([e78e0f8](https://github.com/foobarhq/reworkjs/commit/e78e0f85b69b94dbb0fc2399df71d2e613d8841f))

### [0.28.1](https://github.com/foobarhq/reworkjs/compare/v0.28.0...v0.28.1) (2019-11-08)


### Bug Fixes

* fix husky init crash ([3cc6744](https://github.com/foobarhq/reworkjs/commit/3cc6744850abfc2a5d0f9e7e84e33d447743efca))

## [0.28.0](https://github.com/foobarhq/reworkjs/compare/v0.27.0...v0.28.0) (2019-11-08)


### Features

* improve & update rjs init ([0474666](https://github.com/foobarhq/reworkjs/commit/0474666610bf7124c2b5ec0936135f563c301cba))


### Bug Fixes

* fix logs being persisted to "undefined" dir ([9cae513](https://github.com/foobarhq/reworkjs/commit/9cae513dfde37e1fb46c1f10a1ce0e9f88e13d0e))
* require proper version of react-dom ([c0edf3f](https://github.com/foobarhq/reworkjs/commit/c0edf3fe56b06ccedbca09bf8a6fbf3ad1ba9b6c))

## [0.27.0](https://github.com/foobarhq/reworkjs/compare/v0.26.0...v0.27.0) (2019-10-24)


### Features

* drop srcset-loader as it is dead ([ab4e1ea](https://github.com/foobarhq/reworkjs/commit/ab4e1ea8cb94a814a3225bb3533197727c0786cd))

### ⚠ BREAKING CHANGES

* Any usage of srcset-loader will need to be updated

## [0.26.0](https://github.com/foobarhq/reworkjs/compare/v0.25.2...v0.26.0) (2019-08-06)


### Features

* update react-intl to 3.x.x & remove react-intl workaround ([d870528](https://github.com/foobarhq/reworkjs/commit/d870528))



### [0.25.2](https://github.com/foobarhq/reworkjs/compare/v0.25.1...v0.25.2) (2019-08-02)


### Bug Fixes

* remove [@reworkjs/redux](https://github.com/reworkjs/redux) from externals ([08e5f40](https://github.com/foobarhq/reworkjs/commit/08e5f40))



### [0.25.1](https://github.com/foobarhq/reworkjs/compare/v0.25.0...v0.25.1) (2019-07-12)


### Bug Fixes

* force app refresh after intl change ([24c15f2](https://github.com/foobarhq/reworkjs/commit/24c15f2))
* minify css in production ([c298003](https://github.com/foobarhq/reworkjs/commit/c298003))
* resolve webpack deprecation warnings ([29f1908](https://github.com/foobarhq/reworkjs/commit/29f1908))


### Features

* enable "removeAvailableModules" webpack opti ([31b30b2](https://github.com/foobarhq/reworkjs/commit/31b30b2))



## [0.25.0](https://github.com/foobarhq/reworkjs/compare/v0.24.1...v0.25.0) (2019-07-09)


### Bug Fixes

* create new Chalk instance using Chalk.constructor ([4815551](https://github.com/foobarhq/reworkjs/commit/4815551))
* fix init ignoring errors ([5e2f06b](https://github.com/foobarhq/reworkjs/commit/5e2f06b))
* lazy load server-hooks ([30036ce](https://github.com/foobarhq/reworkjs/commit/30036ce))
* make babel cache env & side aware ([b5e1b3e](https://github.com/foobarhq/reworkjs/commit/b5e1b3e))



### [0.24.1](https://github.com/foobarhq/reworkjs/compare/v0.24.0...v0.24.1) (2019-07-03)


### Bug Fixes

* fix useLocation having undefined in its url ([9084cd5](https://github.com/foobarhq/reworkjs/commit/9084cd5))



## [0.24.0](https://github.com/foobarhq/reworkjs/compare/v0.23.0...v0.24.0) (2019-06-18)


### Bug Fixes

* resolve adhoc hook based on config file *directory* ([4bd941a](https://github.com/foobarhq/reworkjs/commit/4bd941a))


### Features

* allow providing ad-hoc hooks ([8cb50bc](https://github.com/foobarhq/reworkjs/commit/8cb50bc))
* provide hook to configure express ([a66100c](https://github.com/foobarhq/reworkjs/commit/a66100c))



## [0.23.0](https://github.com/foobarhq/reworkjs/compare/v0.22.0...v0.23.0) (2019-06-14)


### Bug Fixes

* don't inject babel-runtime inside of core-js ([833b3c7](https://github.com/foobarhq/reworkjs/commit/833b3c7))
* replace WebpackClean with CleanWebpack ([d9021f5](https://github.com/foobarhq/reworkjs/commit/d9021f5)), closes [#55](https://github.com/foobarhq/reworkjs/issues/55)


### Features

* add config option to use the react-router HashRouter ([840a185](https://github.com/foobarhq/reworkjs/commit/840a185))
* allow people to define a custom path to the configuration file ([5f5b98f](https://github.com/foobarhq/reworkjs/commit/5f5b98f))
* validate configuration using Joi ([9eb9c65](https://github.com/foobarhq/reworkjs/commit/9eb9c65))


### ⚠ BREAKING CHANGES

* default config file is now <project_dir>/.reworkrc
* relative files & directories specified in config file are now relative to folder containing the config file.



## [0.22.0](https://github.com/foobarhq/reworkjs/compare/v0.21.0...v0.22.0) (2019-05-28)


### Bug Fixes

* make exported hooks use non-ssr version by default ([79ededf](https://github.com/foobarhq/reworkjs/commit/79ededf))



## [0.21.0](https://github.com/foobarhq/reworkjs/compare/v0.20.2...v0.21.0) (2019-05-27)


### Bug Fixes

* make server-side use /lib to avoid esm in modules ([4f607e3](https://github.com/foobarhq/reworkjs/commit/4f607e3))
* prevent dev SSR server from crashing if front is ready before back-end ([ebed78c](https://github.com/foobarhq/reworkjs/commit/ebed78c))
* prevent server from crashing in dev mode if an exception occurs during build ([48a64c2](https://github.com/foobarhq/reworkjs/commit/48a64c2))


### Features

* add experimental SSR resource loading ([bb34439](https://github.com/foobarhq/reworkjs/commit/bb34439))
* add support for [@loadable](https://github.com/loadable) ([6b2cbcb](https://github.com/foobarhq/reworkjs/commit/6b2cbcb))
* add usePersistentValue ([472813c](https://github.com/foobarhq/reworkjs/commit/472813c))
* load .browser.ext over .ext on browser, .server.ext on server if present ([422af5e](https://github.com/foobarhq/reworkjs/commit/422af5e))
* make use-location return URL & cause re-render on change ([40b23c8](https://github.com/foobarhq/reworkjs/commit/40b23c8))



### [0.20.2](https://github.com/foobarhq/reworkjs/compare/v0.20.1...v0.20.2) (2019-05-13)


### Bug Fixes

* prevent lodash feature from using babel.config.js when compiling node_modules ([c57cb87](https://github.com/foobarhq/reworkjs/commit/c57cb87))



### [0.20.1](https://github.com/foobarhq/reworkjs/compare/v0.20.0...v0.20.1) (2019-05-07)


### Bug Fixes

* disable using babel.config.js as we load it manually ([b336ba0](https://github.com/foobarhq/reworkjs/commit/b336ba0))



## [0.20.0](https://github.com/foobarhq/reworkjs/compare/v0.19.0...v0.20.0) (2019-04-26)


### Bug Fixes

* don't parse node_modules with remove-prop-types ([9ce4429](https://github.com/foobarhq/reworkjs/commit/9ce4429))


### Features

* add ssr ready use-dnt, use-user-agent, use-location ([5c808c2](https://github.com/foobarhq/reworkjs/commit/5c808c2))
* expose request and response through context when in SSR ([8225d26](https://github.com/foobarhq/reworkjs/commit/8225d26))
* remove compression ([8a76d19](https://github.com/foobarhq/reworkjs/commit/8a76d19))
* replace uglify with terser & update deps ([1537111](https://github.com/foobarhq/reworkjs/commit/1537111))



## [0.19.0](https://github.com/foobarhq/reworkjs/compare/v0.18.0...v0.19.0) (2019-04-23)


### Features

* replace with-context-consumer with with-context ([59600f1](https://github.com/foobarhq/reworkjs/commit/59600f1))



## [0.18.0](https://github.com/foobarhq/reworkjs/compare/v0.17.4...v0.18.0) (2019-04-23)


### Bug Fixes

* babel presets - use NODE_ENV if BABEL_ENV is not set ([2198063](https://github.com/foobarhq/reworkjs/commit/2198063))
* cancel redirect if same url, fix redirect crashing ([b60b536](https://github.com/foobarhq/reworkjs/commit/b60b536))
* make "server" build use /lib instead of /es ([adae823](https://github.com/foobarhq/reworkjs/commit/adae823))


### Features

* remove "webpack" from build folder name ([33d4c28](https://github.com/foobarhq/reworkjs/commit/33d4c28))



### [0.17.4](https://github.com/foobarhq/reworkjs/compare/v0.17.3...v0.17.4) (2019-03-05)


### Bug Fixes

* don't resolve main-component so webpack is the one resolving files ([04a33c1](https://github.com/foobarhq/reworkjs/commit/04a33c1))
* remove .react.js from special file extension (.js is enough) ([798d10a](https://github.com/foobarhq/reworkjs/commit/798d10a))



### [0.17.3](https://github.com/foobarhq/reworkjs/compare/v0.17.2...v0.17.3) (2019-02-22)


### Bug Fixes

* update dependencies & remove explicit regeneratorRuntime ([b40e61f](https://github.com/foobarhq/reworkjs/commit/b40e61f))



### [0.17.2](https://github.com/foobarhq/reworkjs/compare/v0.17.1...v0.17.2) (2019-02-12)


### Bug Fixes

* stringify argv so webpack can replace it in built files ([29dae67](https://github.com/foobarhq/reworkjs/commit/29dae67))



### [0.17.1](https://github.com/foobarhq/reworkjs/compare/v0.17.0...v0.17.1) (2019-02-12)


### Bug Fixes

* make @reworkjs/core/argv work on node processes ([018cfc1](https://github.com/foobarhq/reworkjs/commit/018cfc1))



## [0.17.0](https://github.com/foobarhq/reworkjs/compare/v0.16.0...v0.17.0) (2019-02-11)


### Bug Fixes

* expose context for use in react hooks ([a577078](https://github.com/foobarhq/reworkjs/commit/a577078))
* update usage of old babel plugin ([a2726ee](https://github.com/foobarhq/reworkjs/commit/a2726ee))


### Features

* remove eslint-loader ([220423f](https://github.com/foobarhq/reworkjs/commit/220423f))



## [0.16.0](https://github.com/foobarhq/reworkjs/compare/v0.15.1...v0.16.0) (2019-02-07)


### Bug Fixes

* disable css-loader minimize, move to postcss ([c501eed](https://github.com/foobarhq/reworkjs/commit/c501eed))


### Features

* remove build-in ngrok support ([3f05ca2](https://github.com/foobarhq/reworkjs/commit/3f05ca2))
* remove intl locales not matching available translations ([06e1f1a](https://github.com/foobarhq/reworkjs/commit/06e1f1a))


### ⚠ BREAKING CHANGES

* use ngrok externally



### [0.15.1](https://github.com/foobarhq/reworkjs/compare/v0.15.0...v0.15.1) (2019-01-08)


### Bug Fixes

* **config:** fix setting react-entry crashing the app ([bebefa4](https://github.com/foobarhq/reworkjs/commit/bebefa4))



## [0.15.0](https://github.com/foobarhq/reworkjs/compare/v0.14.1...v0.15.0) (2019-01-08)


### Bug Fixes

* fix crash when persisting locale in cookies ([278abbb](https://github.com/foobarhq/reworkjs/commit/278abbb))
* Store prefered locale on change ([a348e8d](https://github.com/foobarhq/reworkjs/commit/a348e8d))
* **babel:** do not run react preset on node_modules ([b912832](https://github.com/foobarhq/reworkjs/commit/b912832))
* **babel:** fix crashes related to babel update ([deca477](https://github.com/foobarhq/reworkjs/commit/deca477))
* **locale:** enable react-intl locale after it has been loaded ([5ef4818](https://github.com/foobarhq/reworkjs/commit/5ef4818))
* **react-intl:** create locale alias when framework finds one that does not exist in react-intl ([0f1e5c8](https://github.com/foobarhq/reworkjs/commit/0f1e5c8))
* **route:** add key to top level routes ([2d7e693](https://github.com/foobarhq/reworkjs/commit/2d7e693))


### Features

* allow plugins to hook client and server rendering ([d6c2eb0](https://github.com/foobarhq/reworkjs/commit/d6c2eb0))
* completely replace redux with new plugin system ([1170ddf](https://github.com/foobarhq/reworkjs/commit/1170ddf))
* expose singleton instance on plugins ([5dc23ed](https://github.com/foobarhq/reworkjs/commit/5dc23ed))
* hydrate react tree if its container has content, render otherwise ([776ef82](https://github.com/foobarhq/reworkjs/commit/776ef82))
* move public modules from index.js to individual sub-modules ([05d241b](https://github.com/foobarhq/reworkjs/commit/05d241b))
* Prevent ReworkJsWrapper from generating a new Div ([20231ba](https://github.com/foobarhq/reworkjs/commit/20231ba))
* Remove all usages of Redux (will add them through plugins) ([2566067](https://github.com/foobarhq/reworkjs/commit/2566067))
* update to react-router v4 ([61d0860](https://github.com/foobarhq/reworkjs/commit/61d0860))
* **babel:** update to babel 7, update hot reload system, transpile node_modules (stable only) ([c489349](https://github.com/foobarhq/reworkjs/commit/c489349))
* **i18n:** make translations local to a single react tree ([921dec8](https://github.com/foobarhq/reworkjs/commit/921dec8))



### [0.14.1](https://github.com/foobarhq/reworkjs/compare/v0.14.0...v0.14.1) (2018-08-09)


### Bug Fixes

* make get-translations node mock work on non-unix filesystems ([a4424b3](https://github.com/foobarhq/reworkjs/commit/a4424b3))



## [0.14.0](https://github.com/foobarhq/reworkjs/compare/v0.13.0...v0.14.0) (2018-06-12)


### Bug Fixes

* Fix crash when loading a project without an existing configuration file ([48aaf40](https://github.com/foobarhq/reworkjs/commit/48aaf40))
* Make render-html & pre-init optional ([81c5cf2](https://github.com/foobarhq/reworkjs/commit/81c5cf2))


### Features

* Add a way to append a script to the service worker ([5baeb49](https://github.com/foobarhq/reworkjs/commit/5baeb49))



## [0.13.0](https://github.com/foobarhq/reworkjs/compare/v0.12.0...v0.13.0) (2018-05-09)


### Bug Fixes

* Compress CSS files with gzip ([572b59f](https://github.com/foobarhq/reworkjs/commit/572b59f))
* Fix sending a corrupted response when trying to access a precompressed resource with a query parameter ([0d9ca5d](https://github.com/foobarhq/reworkjs/commit/0d9ca5d))
* Make SW cache root route ([5c77e0e](https://github.com/foobarhq/reworkjs/commit/5c77e0e))
* Make the built server able to run from a different directory than the one it was built in ([4f1480c](https://github.com/foobarhq/reworkjs/commit/4f1480c))
* only import framework-config in bundle in development mode ([fc2c95e](https://github.com/foobarhq/reworkjs/commit/fc2c95e))
* Use log directory to store app logs instead of build directory ([cb6837d](https://github.com/foobarhq/reworkjs/commit/cb6837d))


### Features

* Add brotli pre-compress support ([c43844b](https://github.com/foobarhq/reworkjs/commit/c43844b))



## [0.12.0](https://github.com/foobarhq/reworkjs/compare/v0.11.0...v0.12.0) (2018-04-18)


### Bug Fixes

* Disable removeAvailableModules in development ([c7ec6ee](https://github.com/foobarhq/reworkjs/commit/c7ec6ee))
* Disable webp minification ([2832d19](https://github.com/foobarhq/reworkjs/commit/2832d19))
* Fix injecting cookies into BaseHelmet when building the app ([faefd8d](https://github.com/foobarhq/reworkjs/commit/faefd8d))


### Features

* Disable eslint by default ([f1f9e4b](https://github.com/foobarhq/reworkjs/commit/f1f9e4b))


### ⚠ BREAKING CHANGES

* Enable eslint using --features=eslint



## 0.11.0 (2018-04-11)


### Bug Fixes

* Bump required webpack-bundle-analyzer version to solve issue with concat modules ([de8494a](https://github.com/foobarhq/reworkjs/commit/de8494a))
* Don't ss-render context style tags in production ([d9f28b2](https://github.com/foobarhq/reworkjs/commit/d9f28b2))
* Fix app builder crashing in watch mode when initial build failed and an user tries to access it ([fa274bb](https://github.com/foobarhq/reworkjs/commit/fa274bb))
* Fix react not being able to display errors due to cross-origin issues ([49dfbcb](https://github.com/foobarhq/reworkjs/commit/49dfbcb))
* Fix server-side loading of CSS ([fd27864](https://github.com/foobarhq/reworkjs/commit/fd27864))
* Launch pre-rendering server on correct port in prod ([38003c3](https://github.com/foobarhq/reworkjs/commit/38003c3))
* Make render-html config entry work with SSR ([d9c5a73](https://github.com/foobarhq/reworkjs/commit/d9c5a73))
* Migrate optimization plugins to webpack.optimization ([bd8152d](https://github.com/foobarhq/reworkjs/commit/bd8152d))
* Only pre-render CSS as `<style>` tags in development ([71ce71b](https://github.com/foobarhq/reworkjs/commit/71ce71b))
* Only pre-serve named bundles for reliability ([7d4f6ae](https://github.com/foobarhq/reworkjs/commit/7d4f6ae))
* Optimize images on the server too so their hash is identical to the front-end ([8a6af49](https://github.com/foobarhq/reworkjs/commit/8a6af49))
* Prevent passing webp files to file-loader twice ([c072796](https://github.com/foobarhq/reworkjs/commit/c072796))
* Remove --no-prerendering warning as prerendering is now off by default ([a605987](https://github.com/foobarhq/reworkjs/commit/a605987))
* Replace deprecated webpack.optimize.UglifyJsPlugin with uglifyjs-webpack-plugin ([f0eac80](https://github.com/foobarhq/reworkjs/commit/f0eac80))
* Set lang html attribute to loaded language ([f64c6b2](https://github.com/foobarhq/reworkjs/commit/f64c6b2))


### Features

* Add support for loading .mjs files ([2c80a58](https://github.com/foobarhq/reworkjs/commit/2c80a58))
* Add support for webp ([06843a5](https://github.com/foobarhq/reworkjs/commit/06843a5))
* Don't generate chunk names in splitChunks for long term caching ([fa82439](https://github.com/foobarhq/reworkjs/commit/fa82439))
* CSS is now split per chunk ([43554a3](https://github.com/foobarhq/reworkjs/commit/43554a3))
* **webpack:** Pass WebP to imagemin, configure mozjpeg&gifsicle ([1660ad3](https://github.com/foobarhq/reworkjs/commit/1660ad3))
* Update dependencies ([a4265af](https://github.com/foobarhq/reworkjs/commit/a4265af))
* Update peer dependencies ([32646bb](https://github.com/foobarhq/reworkjs/commit/32646bb))
* Migrate to React 16.3.1

### ⚠ Breaking Changes

* Drop support for node &lt; latest LTS (= 8) ([80b76be](https://github.com/foobarhq/reworkjs/commit/80b76be))
