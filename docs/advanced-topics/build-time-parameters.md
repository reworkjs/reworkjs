TODO

options:

- pass arguments through argv (`rjs build client -- --apiUrl=https://api.site.com`) -> `import argv from '@reworkjs/core/argv';`
- use `preval.macro`:
  ```javascript
  import preval from 'preval.macro';

  // language=JavaScript
  const IS_STAGING = preval`
    module.exports = process.env.IS_STAGING === 'true';
  `;
  ```
- use `env-loader`
