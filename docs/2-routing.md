---
name: Routing
route: /routing
---

# Routing

Routing in rework.js is handled by [React Router DOM](https://reacttraining.com/react-router/web), with sprinkles added on top.

## Creating a new Route

The default router treats all files named `*.route.js`* as route definitions.

The route file should default-export an object containing the metadata of the route: `path` & `component`

```typescript
// src/pages/home.route.ts

export default {
  path: '/',

  // the react component to render on the homepage, works like any other component.
  // see bellow for lazy-loading
  component: MyLazyLoadedComponent,
}
```

* The actual default pattern is `src/**/*.route.{js,jsx,mjs,ts,tsx}`

## Code Splitting & Lazy Loading

Code splitting in rework.js is handled by [Loadable Components](https://www.smooth-code.com/open-source/loadable-components/).

If we take the example above and expand it to lazy-load the homepage, we would end up with the following code:

```typescript
// src/pages/home/home.route.ts

import loadable from '@loadable/component';
import CircularProgress from '@material-ui/core/CircularProgress';

export default {
  path: '/',

  // lazy-load the homepage
  component: loadable(() => import('./home.view'), {
    fallback: <CircularProgress />,
  }),
}
```

N.B.: You can lazy-load components anywhere using loadable, this is *not* strictly limited to route definitions.

That library is fully integrated with the framework, including server-side rendering.
Please refer to [their documentation](https://www.smooth-code.com/open-source/loadable-components/) for more information on code splitting.

## Catch-all routes (404)

Creating a catch-all route works pretty much the same. It is your standard route definition with a few differences:

- `path` must be set to `*` to match all urls
- `priority` must be set to a low number so the route is matched last (if a catch-all route is matched first, all pages will display the catch-all).
- (SSR) `status` can be set to any HTTP status code (eg. `404`) if you wish to change the status code the server will return.

```typescript
// src/pages/404/404.route.ts

import * as React from 'react';
import loadable from '@loadable/component';
import CircularProgress from '@material-ui/core/CircularProgress';

export default {
  // match all urls
  path: '*',
  // make this route definition match last
  priority: 0,
  // if this route matches, change ssr http status to 404
  status: 404,

  component: loadable(() => import('./404.view'), {
    fallback: <CircularProgress />,
  }),
};
```

## HTTP status codes

Setting the HTTP status for SSR can be done either by setting the `status` property on your route definition
or using the [React-Router APIs](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md#404-401-or-any-other-status)

The react-router way is a bit cumbersome so rework.js exposes two utilities you can use instead: `HttpStatus` & `useHttpStatus`. They are used like this:

```typescript jsx
// HttpStatus component

// src/pages/404/404.view.tsx
import { HttpStatus } from '@reworkjs/core/router';

function My404Page() {
  return (
    <>
      <HttpStatus code={404} />
      Resource not found!
    </>
  );
}
```

```typescript jsx
// useHttpStatus hook

// src/pages/404/404.view.tsx
import { useHttpStatus } from '@reworkjs/core/router';

function My404Page() {

  useHttpStatus(404);

  return (
    <>
      Resource not found!
    </>
  );
}
```

## Advanced Routing

While this route-loading system, it also limits what can be done with React-Router.

If you wish to bypass it and come back to React-Router, you can create a single route file that will act as your router:

```typescript jsx
// src/pages/router.route.tsx

import { Switch } from 'react-router-dom';

export default {
  // match all urls
  path: '*',
  component: MyRouter,
};

function MyRouter() {
  return (
    <Switch>
      {/* check out react-router for documentation on their routing! */}
    </Switch>
  );
}
```
