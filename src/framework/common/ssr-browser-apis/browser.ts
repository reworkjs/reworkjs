import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useUserAgent(): string {
  return window.navigator.userAgent;
}

export function useDnt(): string {
  return window.navigator.doNotTrack || 'unspecified';
}

export function useSsrLocation(): URL {
  // we use React Router so useLocation causes a re-render if location changes in browser.
  const location = useLocation();

  const url = new URL(window.location.href); // get origin from `location`
  url.pathname = location.pathname;
  url.search = location.search;
  url.hash = location.hash;

  const urlObjectRef = useRef(url);

  // only return a new object if href changed, or object was tampered with.
  if (urlObjectRef.current.href !== url.href) {
    urlObjectRef.current = url;
  }

  return urlObjectRef.current;
}

export function useAcceptLanguage(): readonly string[] {
  const [languages, setLanguages] = useState<readonly string[]>(getLanguages());

  useEffect(() => {
    const cb = () => {
      setLanguages(getLanguages());
    };

    window.addEventListener('languagechange', cb);

    return () => {
      window.removeEventListener('languagechange', cb);
    };
  }, []);

  return languages;
}

function getLanguages() {
  return Object.freeze([...navigator.languages]);
}
