# rjs start

prod could simply delegate: a call to `rjs build` then call to `rjs serve`

dev must go through `webpackDevMiddleware` (server & client)

## prod + ssr

- build client bundle + server bundle ONCE (call to `NODE_ENV=production rjs build client server`?)
- start SSR server (server bundle) (call to `rjs serve --ssr`?)
-- serves static files
-- serves live routes if no static file found

## prod NO SSR

- build client bundle ONCE (call to `NODE_ENV=production rjs build client`?)
- start static file server (call to `rjs serve --no-ssr`?)
-- serves static files
-- serves index.html if no static file found

## dev + ssr

the special one: two servers (dev front, dev back)

- get compile client & server with watch compilers
- launch client
-- launch webpackDevMiddleware & pass client compiler
-- launch proxy to SSR server
- launch SSR (bundle output, other process)
-- wait for watch compiler to finish & start it
-- restart it on hot reload

## dev NO ssr

- compile client & server with watch (retrieve webpack compilers)
- launch client
-- launch webpackDevMiddleware & pass client webpack compiler
-- serves index.html if no static file found

### Organisation

- `framework/client`:
  - Client Bundle Entry Point (React.render)
  - calls pre-init, React.render
- `framework/server`:
  - [PROD SSR] Server Bundle Entry Point (express app)
  - calls pre-init, server-hooks, serveReactRoute
- `internals/server`:
  - [PROD NO SSR] `serve-no-ssr.js`
    - Fully static server (serves static files + fallback index.html)
  - [DEV NO SSR] `start-no-ssr.js`
    - calls `build client` API
    - Starts Client server (once, webpackDevMiddleware)
    - fallback to index.html
  - [DEV SSR] `start-ssr.js`
    - calls `build client server --watch` API (or `build(client, server, watch: true)`)
    - Starts Client server (once, webpackDevMiddleware)
    - Starts and hot reloads SSR server (sub-process, needs to be killable)

### Parallelism

- parallel-webpack (each build in parallel - client/server) OR each compiler on their own process
- thread-loader (parallel loaders, eg babel)?
- dev only: SSR always on its own process, client on main process is fine.

### Reporting

for split view (start command only):

- limit split view to [client + builders] & [server]
- add progress bar

### Unification

Building must be an internal api which looks like this:

```javascript
function build(
  sides: {
    client: boolean,
    server: boolean,
  }, 
  opts: {
    watch: boolean,
    mode: 'PRODUCTION' | 'DEVELOPMENT',
  },
): { // out
  client: { compiler: WebpackCompiler },
  server: { compiler: WebpackCompiler },
} {}
```

# rjs build

- `rjs build client server --watch` calls `build` function with watch + mode & enables IPC
- `rjs build client server` calls `build` function with mode & exits with status code

# rjs serve

*PROD ONLY*

WITH SSR: launches `.build/server/main.js`
WITHOUT SSR: launches `internals/server/serve-no-ssr.js`
