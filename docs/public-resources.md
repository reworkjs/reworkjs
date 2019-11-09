# Public Resources

TODO: link to .reworkrc documentation

Resources located in the `resources` directory will be copied as-is at the root of the build directory.  
These resources are not processed by webpack, no modification of any kind is done to them.

E.g.: if your resource is located in `src/public/favicon.ico` and your resource folder is `src/public`, your icon will be available
under `/favicon.ico`

symlinks will be followed when copying the contents of the `resources` folder, allowing you to reference files stored 
in vendor folders such as `node_modules`, `bower_modules`.

N.B.: You should avoid importing files located in `resources` using Webpack mechanisms (such as the `import` statement) as
that will cause the resource to be bundled twice. Instead, load that resource using browser loading systems (`<link>`, `<img>`, etc...).
