---
name: Public Resources
route: /public-resources
---

# Public Resources

There are two way to access resources with rework.js: statically or through webpack

## Webpack resources

This is the "standard" way to import resources in rework.js. You do this by using the JavaScript `import` statement. The url of the resource will be returned (note: that won't download the resource, only give you the url).

```typescript jsx
// my-comp.tsx

import logoUrl from './logo.svg';

export default function Logo() {
  return <img src={logoUrl} />;
}
```

Resources imported this way have some processing applied to them:

- They will usually be optimised if possible
- Their URL can change between two builds because a hash will be added to their URL for cache-busting.

This system will not always meet your needs. If you need webpack to back-off and let you have full control over your resource,
you'll want to use Static Resources (see below).

## Static resources

Resources located in the [`resources`](https://www.reworkjs.com/configuration#directoriesresources) directory will be copied as-is at the root of the build directory.  
These resources are not processed by webpack, no modification of any kind is done to them.

The directory is `./src/public` by default but is configurable.

In order to access the resource, you can't import its url. Instead, you reference it by URL directly.  
E.g.: if your resource is located in `<resource_folder>/favicon.ico`, your icon will be available as `/favicon.ico`

symlinks will be followed when copying the contents of the `resources` folder, allowing you to reference files stored 
in vendor folders such as `node_modules`, `bower_modules`.

N.B.: You should avoid importing files located in `resources` using Webpack mechanisms (such as the `import` statement) as
that will cause the resource to be bundled twice. Instead, load that resource using browser loading systems (`<link>`, `<img>`, etc...).
