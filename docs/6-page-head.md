---
name: Page Metadata (head)
route: /page-metadata
---

# Page Metadata

Setting the page metadata is handled by [`react-helmet-async`](https://github.com/staylor/react-helmet-async).
There is no need to setup it, simply start using it!

```typescript jsx
// pages/home/home.view.tsx

import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export default function HomeView() {
  return (
    <>
      <Helmet>
        <title>HomePage | MyCoolSite</title>
      </Helmet>

      <p>Welcome to my cool site</p>
    </>
  );
}
```
