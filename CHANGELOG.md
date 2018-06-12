# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.14.0"></a>
# [0.14.0](https://github.com/foobarhq/reworkjs/compare/v0.13.0...v0.14.0) (2018-06-12)


### Bug Fixes

* Fix crash when loading a project without an existing configuration file ([48aaf40](https://github.com/foobarhq/reworkjs/commit/48aaf40))
* Make render-html & pre-init optional ([81c5cf2](https://github.com/foobarhq/reworkjs/commit/81c5cf2))


### Features

* Add a way to append a script to the service worker ([5baeb49](https://github.com/foobarhq/reworkjs/commit/5baeb49))



<a name="0.13.0"></a>
# [0.13.0](https://github.com/foobarhq/reworkjs/compare/v0.12.0...v0.13.0) (2018-05-09)


### Bug Fixes

* Compress CSS files with gzip ([572b59f](https://github.com/foobarhq/reworkjs/commit/572b59f))
* Fix sending a corrupted response when trying to access a precompressed resource with a query parameter ([0d9ca5d](https://github.com/foobarhq/reworkjs/commit/0d9ca5d))
* Make SW cache root route ([5c77e0e](https://github.com/foobarhq/reworkjs/commit/5c77e0e))
* Make the built server able to run from a different directory than the one it was built in ([4f1480c](https://github.com/foobarhq/reworkjs/commit/4f1480c))
* only import framework-config in bundle in development mode ([fc2c95e](https://github.com/foobarhq/reworkjs/commit/fc2c95e))
* Use log directory to store app logs instead of build directory ([cb6837d](https://github.com/foobarhq/reworkjs/commit/cb6837d))


### Features

* Add brotli pre-compress support ([c43844b](https://github.com/foobarhq/reworkjs/commit/c43844b))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/foobarhq/reworkjs/compare/v0.11.0...v0.12.0) (2018-04-18)


### Bug Fixes

* Disable removeAvailableModules in development ([c7ec6ee](https://github.com/foobarhq/reworkjs/commit/c7ec6ee))
* Disable webp minification ([2832d19](https://github.com/foobarhq/reworkjs/commit/2832d19))
* Fix injecting cookies into BaseHelmet when building the app ([faefd8d](https://github.com/foobarhq/reworkjs/commit/faefd8d))


### Features

* Disable eslint by default ([f1f9e4b](https://github.com/foobarhq/reworkjs/commit/f1f9e4b))


### BREAKING CHANGES

* Enable eslint using --features=eslint



<a name="0.11.0"></a>
# 0.11.0 (2018-04-11)


### Bug Fixes

* Bump required webpack-bundle-analyzer version to solve issue with concat modules ([de8494a](https://github.com/foobarhq/reworkjs/commit/de8494a))
* Don't ss-render context style tags in production ([d9f28b2](https://github.com/foobarhq/reworkjs/commit/d9f28b2))
* Fix app builder crashing in watch mode when initial build failed and an user tries to access it ([fa274bb](https://github.com/foobarhq/reworkjs/commit/fa274bb))
* Fix react not being able to display errors due to cross-origin issues ([49dfbcb](https://github.com/foobarhq/reworkjs/commit/49dfbcb))
* Fix server-side loading of CSS ([fd27864](https://github.com/foobarhq/reworkjs/commit/fd27864))
* Launch pre-rendering server on correct port in prod ([38003c3](https://github.com/foobarhq/reworkjs/commit/38003c3))
* Make render-html config entry work with SSR ([d9c5a73](https://github.com/foobarhq/reworkjs/commit/d9c5a73))
* Migrate optimization plugins to webpack.optimization ([bd8152d](https://github.com/foobarhq/reworkjs/commit/bd8152d))
* Only pre-render CSS as <style> tags in development ([71ce71b](https://github.com/foobarhq/reworkjs/commit/71ce71b))
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

### Breaking Changes

* Drop support for node < latest LTS (= 8) ([80b76be](https://github.com/foobarhq/reworkjs/commit/80b76be))
