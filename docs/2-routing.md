---
name: Routing
route: /routing
---

# Routing

Routing in rework.js is handled by [React Router DOM](https://reacttraining.com/react-router/web).

You have two ways of creating routes: By manually creating a route definition file, or using annotations.

## Declaring a Route using Annotations

Annotations is the simplest way to create routes. 
Any file ending with `*.page.tsx` can include an annotation at the start of the file specifying the
routing information for that page.

Simply add the comment `// @route.path <my-path>` where `<my-path>` is the desired path, and it will be
automatically loaded.

These pages are [*lazy loaded*](#code-splitting--lazy-loading) by default. No boilerplate required.

### Index Page

```typescript jsx
// src/pages/home.page.tsx
// @route.path /

export default function HomePage() {
  return <p>Hello, World</p>;
}
```

### Parametrized Page

`@route.path` accepts any path that is compatible with react-router, including options & parameters:

```typescript jsx
// src/pages/user.page.tsx
// @route.path /users/:userId

import { useParams } from 'react-router-dom';

export default function UserPage() {
  const { userId } = useParams();
  
  return <p>Hello, {userId}</p>;
}
```

### 404 Page

Catch-all routes, defined using `@route.path *` should also make use of `@route.priority` to 
ensure they are matched only if all other routes do not match.

Route priority is at 0 by default.

```typescript jsx
// src/pages/404.page.tsx
// @route.path *
// @route.priority -9999

export default function Error404Page() {
  return (
    <>
      <HttpStatus code={404} />
      Resource not found!
    </>
  );
}
```

## Declaring a Route Manually

This is a more verbose way than [using annotations](./routing.md#declaring-a-route-using-annotations), but it gives you more control over:

- whether components are lazy-loaded or not,
- [how webpack lazy-loads the component](https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import)
- [the configuration of `loadable`](#code-splitting--lazy-loading),

The default router treats all files named `*.route.js` as route definitions.

The route file should default-export an object containing the metadata of the route: `path` & `component`

```typescript
// src/pages/home.route.ts

export default {
  path: '/',

  // The react component to render on the homepage, works like any other component.
  // Note: this one is not lazy-loaded. See next section for lazy-loading.
  component: MyComponent,
}
```

* The actual default pattern is `src/**/*.route.{js,jsx,mjs,ts,tsx}`

### Code Splitting & Lazy Loading

Code splitting in rework.js is handled by [Loadable Components](https://www.smooth-code.com/open-source/loadable-components/).

If we take the example above and expand it to lazy-load the homepage, we would end up with the following code:

```typescript jsx
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

### Catch-all routes (404)

Creating a catch-all route works pretty much the same. It is your standard route definition with a few differences:

- `path` must be set to `*` to match all urls
- `priority` must be set to a low number so the route is matched last (if a catch-all route is matched first, all pages will display the catch-all).

```typescript jsx
// src/pages/404/404.route.ts

import * as React from 'react';
import loadable from '@loadable/component';
import CircularProgress from '@material-ui/core/CircularProgress';

export default {
  // match all urls
  path: '*',
  // make this route definition match last
  priority: -9999,

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
