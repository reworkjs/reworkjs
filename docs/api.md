---
name: API
route: /api
---

## Interacting with browser data

-> cookies, react-cookie
-> useUserAgent
-> useLocation
-> useDnt
-> useUserLanguages, UserLanguagesContext
-> i18n:
--> isTranslationSupported
--> onIntlHotReload
--> `[locale, setLocale] = useActiveLocale()`
-> argv
-> babel-preset
- useReactRouter
- `process.env.SIDE`, `process.env.NODE_ENV`

## SSR

- usePersistentValue
- useAsyncResource
- useRes, useReq, SsrContext
- useHttpStatus(404)
- HttpStatus

## Service Worker

- `useRestartRequired`

## Utils

-> logger.js
