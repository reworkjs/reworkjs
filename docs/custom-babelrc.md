# Custom `.babelrc`

Rework pre-configures babel to transpile stable ES and React features.

Following is the list of babel plugins ran by default:

- **Ran on both your project and `node_modules`**
  - @babel/preset-env
  - @babel/plugin-transform-runtime
  - babel-plugin-transform-react-remove-prop-types (production only)
  - @babel/plugin-transform-react-constant-elements (production only)
  - babel-plugin-lodash (production only)
- **Ran on your project only**
  - @babel/plugin-react-intl-auto
  - @babel/plugin-syntax-dynamic-import
  - @babel/preset-react
  - react-hot-loader/babel (dev with HMR only)

If you need to specify which EcmaScript features should be transpiled, we recommend you do so by creating a `.browserlistsrc` file in the root directory of your project. This will affect both your dependencies and your source code.

If you need to configure it further, you can create your own .babelrc. Keep in mind that this configuration will only be used for the source code of your project, not your dependencies. \
If you choose to do so, you should use `@reworkjs/core/babel-preset` as the preset:

```json5
// .babelrc

{
  "presets": ["@reworkjs/core/babel-preset"],
  "plugins": [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```

Note: all default plugins can be configured by passing an option object to the babel preset, where the key is the name of the plugin you wish to configure and the key is its configuration.

```json5
// .babelrc

{
  "presets": ["@reworkjs/core/babel-preset", {
    "@babel/plugin-transform-runtime": {
      "corejs": true
    }
  }],
  "plugins": [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```
