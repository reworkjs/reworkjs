/* eslint-disable */
export default class RequireEnsureHookPlugin {

  apply(compiler) {
    compiler.plugin('compilation', RequireEnsureHookPlugin.onCompilation);
  }

  static onCompilation(compilation) {
    const mainTemplate = compilation.mainTemplate;

    // add hook methods
    mainTemplate.plugin('require-extensions', function (source) {
      return this.asString([
        source,
        '',
        '// RequireEnsureHookPlugin',
        `${this.requireFn}.rjs = {`,
        this.indent([
          'hooks: [],',
          `hook: function (cb) { ${this.requireFn}.rjs.hooks.push(cb) },`,
          'unhook: function (cb) {',
          this.indent([
            `var hooks = ${this.requireFn}.rjs.hooks;`,
            'var i = hooks.indexOf(cb);',
            'if (i !== -1) { hooks.splice(i, 1); }',
          ]),
          '}',
        ]),
        '}',
      ]);
    });

    // add hook inside __webpack_require.e
    mainTemplate.plugin('require-ensure', function (currentSource) {
      return this.asString([
        '// RequireEnsureHookPlugin',
        `for (var i = 0; i < ${this.requireFn}.rjs.hooks.length; i++) {`,
        this.indent(`${this.requireFn}.rjs.hooks[i].apply(null, arguments);`),
        '}',
        '',
        currentSource,
      ]);
    });
  }
}
