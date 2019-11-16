---
menu: JavaScript flavors
name: TypeScript
route: /typescript
---

# TypeScript

## Install

rework.js treats TypeScript files like other files. While tsc won't be used, you can use the built-in babel integration
 to compile typescript files by adding the `@babel/preset-typescript` package to `babel.config.js`.

```javascript
// babel.config.js

module.exports = {
  presets: [
    ['@reworkjs/core/babel-preset'],
    ['@babel/preset-typescript', {
      isTSX: true,
      allExtensions: true,
    }],
  ],
};
```

## Typechecking

Babel will not check whether the typing is correct when building, but you can use tsc to typecheck 
with this command: `tsc --noEmit --project tsconfig.json --skipLibCheck`.  
You will need to install TypeScript (`npm i -D typescript`)

You will also need to configure tsc through tsconfig:

```json5
// tsconfig.json

{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "jsx": "react",
    "strict": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "rootDir": "src",
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "*": [
        "node_modules/*",
        "types/*"
      ]
    }
  },
  "include": [
    "src/**/*"
  ]
}
```

rework.js uses a number of libraries with which you will interact. Please install their typing to avoid any typing error:

`npm i -D @types/loadable__component`

### CSS TypeChecking

Because we import css files as if it were JavaScript, we need to tell TypeScript how to interpret it.
Simply adding the following file in your project will do it:

```typescript
// style.d.ts 

// css & css modules
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// scss & scss modules
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
``` 
