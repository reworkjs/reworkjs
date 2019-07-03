// @flow

import { useRef } from 'react';
import useRouter from 'use-react-router';

export function useLocation(): URL {
  // we use React Router so useLocation causes a re-render if location changes in browser.
  const router = useRouter();

  const url = new URL(window.location.href); // get origin from `location`
  url.pathname = router.location.pathname;
  url.search = router.location.search;
  url.hash = router.location.hash;

  const urlObjectRef = useRef(url);

  // only return a new object if href changed, or object was tampered with.
  if (urlObjectRef.current.href !== url.href) {
    urlObjectRef.current = url;
  }

  return urlObjectRef.current;
}
