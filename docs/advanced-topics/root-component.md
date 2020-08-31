---
name: The Root Component
menu: Advanced Topics
route: /route-wrapper
---

# Root Component

rework provides a convenient way to run code on all pages: The root component.

This component is one of the top-most one. By default, this is the component whose file path is `src/components/App` (if any),
this can be changed [in the configuration](configuration.md#entry-react) under the `entry-react` property.

## Usages

You can use this component for a multitude of things such as:
- setting a common [`Helmet`](../6-page-head.md),
- app-wide providers,
- adding an app-wide `componentDidCatch()`,
- prevent rendering of the whole app until some resources have loaded (by not rendering the `children` prop).

**Note**: This component will receive the rest of the app tree under the `children` prop. This prop must
be rendered or the rest of the app will not render.

```tsx
import * as React from 'react';
import { Helmet } from 'react-helmet-async';

type Props = {
  children: React.ReactNode,
};

export default function App(props: Props) {
  // the `children` prop contains the rest of the component tree of the app.
  return (
    <>
      <Helmet defaultTitle="My Site" titleTemplate="My Site - %s" />
      {props.children}
    </>
  );
}
```
