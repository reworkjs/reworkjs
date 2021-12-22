---
name: Configuration
menu: Advanced Topics
route: /configuration
---

# rework Configuration

The rework configuration gives you the ability to customise the framework to your liking, and to enable plugins.

By default, the configuration file should be named `.reworkrc` and
be placed at the root of your project. (see also: [How to specifify the configiguration file path](#specifying-the-path-to-the-configuration-file))

## Contents

Example configuration file with all entries:

```json
{
  "routingType": "browser",
  "directories": {
    "logs": "./.build",
    "build": "./.build",
    "resources": "./src/public",
    "translations": "./src/translations"
  },
  "routes": "**/*.route.{js,jsx,ts,tsx}",
  "pages": "**/*.page.{js,jsx,ts,tsx}",
  "entry-react": "./src/components/App",
  "render-html": "./src/render-html.js",
  "pre-init": "./src/pre-init.js",
  "service-worker": "./src/service-worker.js",
  "plugins": {
    "@reworkjs/redux": {}
  }
}
```

All entries are optional
Paths are resolved from the location of your configuration file

**Important note:** Changes to the configuration files will only take effect after the app has been restarted.

### `routingType`

Default: `browser`

The type of router to use, see [React-Router](https://reacttraining.com/react-router/web) documentation for more information on the types of routers.

Possible values: `browser` for [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter), `hash` for [HashRouter](https://reacttraining.com/react-router/web/api/HashRouter)

### 'emit-integrity'

Default: `true`

Emit [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) on generated assets.
This might cause issues when loading using the `file://` protocol on some platforms, such as Cordova iOS.

Note: Subresource integrity is always disabled in development mode.

### `directories.build`

Default: `./.build`

The directory in which compiled files will be outputted.

server files will be located in `{directories.build}/server`
client files will be located in `{directories.build}/client`

### `directories.logs`

Default: Value of `directories.build`

The directory in which build & running logs will be outputted.

### `directories.resources`

Default: `./src/public`

This directory contains assets that should not be transformed and will merely be copied over. (default: `./src/public`)

The files located inside of `resources` will be copied inside of the `public` directory in the output files.
Be careful not to use the name of a built resource (such as `index.html` or `main.js`).

See the chapter on [Public Resources](../4-public-resources.md) for more information

### `directories.translations`

Default: `./src/translations`

This directory contains the translation files used by `react-intl`. See the chapter about [i18n](../5-i18n.md)

### `routes`

Default: `src/**/*.route.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`

A glob matching all files that should be interpreted as route definitions. See the chapter about [manual routing](./routing.md#declaring-a-route-manually) for more information.

### `pages`

Default: `src/**/*.{view,page}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`

A glob matching all files that can added to the list of routes, using routing annotations. See the chapter about [routing with annotations](./routing.md#declaring-a-route-using-annotations) for more information.

### `pre-init`

Default: none

This file allows you to specify code to run before the rest of your application is loaded. You can use it to load
dependencies needed by your application, such as polyfills.

This file can have a single, optional, default export that is either a Promise, or a function (which optionally returns a Promise).

If exporting a Promise, your application will be loaded after the promise resolves

If exporting a Function, your application will be loaded after the execution of the function and after the Promise the function returns (if any) resolves.

## `entry-react`

See [The Root Component](root-component.md)

### `render-html`

TBD

### `service-worker`

Default: none

If specified, the file will be loaded inside of the service worker.

## `hooks`

See [The first section of Plugins](plugins.md#hook-system)

## `plugins`

See [The second section of Plugins](plugins.md#plugin-system)

## Specifying the path to the configuration file

Specify the `--reworkrc` argument in the `rjs` cli to change the used configuration file: `rjs start --reworkrc=./app/.reworkrc`
