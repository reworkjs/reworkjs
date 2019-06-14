# Public Resources

Public resources are resources which will be copied as-is in the build. They will never be processed, and should never
be imported using webpack's `import` or `require`. Instead, reference them directly by url starting with `/public` 
(e.g. `/public/font-awesome/css/font-awesome.min.css`) using `React-Helmet` and other native import systems.

As they will never be processed, they will not be optimised by the framework. As such, this public folder should 
be used as a last resort if `import`-ing the resource using JavaScript does not work. 

Symbolic links will be processed when copying the contents of this folder, allowing you to reference files stored 
inside `node_modules`.
