import fs from 'fs';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { collectInitial, collectContext } from 'node-style-loader/collect';
import accept from 'accept';
import { getDefault } from '../../../shared/util/ModuleUtil';
import getWebpackSettings from '../../../shared/webpack-settings';
import { rootRoute } from '../../common/kernel';
import ReworkRootComponent from '../../app/ReworkRootComponent';
import { LanguageProvider } from '../../common/accept-language-context';
import ServerHooks from '../server-hooks';
import renderPage from './render-page';

export default async function serveReactRoute(req, res, next): ?{ appHtml: string, state: Object, style: string } {

  try {
    hookWebpackAsyncRequire();

    const serverHooks = ServerHooks.map(hookModule => {
      const HookClass = getDefault(hookModule);

      return new HookClass();
    });

    try {
      const acceptedLanguages = accept.languages(req.header('Accept-Language'));

      let component = (
        <LanguageProvider value={acceptedLanguages}>
          <CookiesProvider cookies={req.universalCookies}>
            <ReworkRootComponent>
              {rootRoute}
            </ReworkRootComponent>
          </CookiesProvider>
        </LanguageProvider>
      );

      // allow plugins to add components
      for (const serverHook of serverHooks) {
        if (serverHook.wrapRootComponent) {
          component = serverHook.wrapRootComponent(component);
        }
      }

      // TODO:
      // renderToNodeStream
      // -> need support for React-Helmet
      //  https://github.com/nfl/react-helmet/issues/322
      //  https://github.com/staylor/react-helmet-async
      // -> need a way to wrap with surrounding HTML
      //
      // TODO:
      // get http-equiv meta from Helmet, and send them as actual headers
      const renderApp = () => {
        const routingContext = {};

        routingContext.markup = renderToString(
          <StaticRouter location={req.url} context={routingContext}>
            {component}
          </StaticRouter>
        );

        return routingContext;
      };

      const compilationStats = await getCompilationStats();

      let header = '';
      let routingContext;
      if (process.env.NODE_ENV === 'development') {
        // There is no CSS entry point in dev mode, generate it with collectInitial/collectContext instead.
        header += collectInitial();
        const renderedApp = collectContext(renderApp);
        header += renderedApp[0]; // 0 = collected CSS
        routingContext = renderedApp[1]; // 1 = rendered HTML
      } else {
        header += compilationStats.client.entryPoints.css;
        routingContext = renderApp();
      }

      // Somewhere a `<Redirect>` was rendered
      if (routingContext.url) {
        return void res.redirect(context.status || 301, routingContext.url);
      }

      if (routingContext.status) {
        res.status(routingContext.status);
      }

      const importedServerChunks: Set = unhookWebpackAsyncRequire();
      const importableClientChunks = [];
      for (const importedServerChunk of importedServerChunks) {
        const chunkFiles: ?Array<string> = getClientFilesFromServerChunkId(importedServerChunk, compilationStats);
        if (!chunkFiles) {
          continue;
        }

        importableClientChunks.push(...chunkFiles.map(getChunkPrefetchLink));
      }

      header += importableClientChunks.join('');

      let htmlParts = {

        // initial react app
        body: routingContext.markup,

        // initial style & pre-loaded JS
        header,

        // inject main webpack bundle
        footer: `${compilationStats.client.entryPoints.js}`,
      };

      // allow plugins to edit HTML (add script, etc) before actual render.
      for (const serverHook of serverHooks) {
        if (serverHook.preRender) {
          htmlParts = serverHook.preRender(htmlParts);
        }
      }

      res.send(renderPage(htmlParts));
    } finally {
      // allow plugins to cleanup
      for (const serverHook of serverHooks) {
        if (serverHook.postRequest) {
          serverHook.postRequest();
        }
      }
    }
  } catch (e) {
    next(e);
  } finally {
    unhookWebpackAsyncRequire();
  }
}

type CompilationStats = {
  client: {
    entryPoints: {
      js: string,
      css: string,
    },
    chunkFileNames: { [key: string]: string },
  },
  server: {
    chunkNames: { [key: string]: string },
  },
};

/**
 * Return the list of files a chunk has in the client build, using the id of a chunk from the server build.
 * This is done using uniquely named chunks.
 */
function getClientFilesFromServerChunkId(serverChunkId: number, stats: CompilationStats): ?Array<string> {
  // Get the name of a chunk using its server build ID.
  const chunkName = stats.server.chunkNames[serverChunkId];
  if (!chunkName) {
    return null;
  }

  // Get list of files that compose the Chunk in the client build.
  return stats.client.chunkFileNames[chunkName] || null;
}

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const clientBuildDirectory = webpackClientConfig.output.path;
const serverBuildDirectory = getWebpackSettings(/* is server */ true).output.path;

let compStatCache;
function getCompilationStats(): CompilationStats {
  if (compStatCache) {
    return compStatCache;
  }

  return Promise.all([
    readFileAsync(`${serverBuildDirectory}-entrypoints.json`),
    readFileAsync(`${clientBuildDirectory}-entrypoints.json`),
  ]).then(([serverStats, clientStats]) => {

    serverStats = JSON.parse(serverStats);
    clientStats = JSON.parse(clientStats);

    clientStats.entryPoints = buildEntryPointTags(clientStats.entryPoints);
    delete serverStats.entryPoints;

    const compStats = {
      server: serverStats,
      client: clientStats,
    };

    if (process.env.NODE_ENV === 'production') {
      compStatCache = compStats;
    }

    return compStats;
  });
}

const httpStaticPath = webpackClientConfig.output.publicPath;

function getChunkPrefetchLink(fileName: string) {
  const path = httpStaticPath + fileName;

  if (fileName.endsWith('.css')) {
    return `<link rel="stylesheet" href="${path}" />`;
  }

  if (fileName.endsWith('.js')) {
    return `<link rel="prefetch" href="${path}" as="script" pr="1.0" />`;
  }

  throw new Error(`Trying to load unsupported file ${fileName}.`);
}

function buildEntryPointTags(entryPoints) {
  entryPoints.js = entryPoints.js.map(entryPoint => `<script src="${httpStaticPath + entryPoint}"></script>`).join('');
  entryPoints.css = entryPoints.css.map(entryPoint => `<link rel="stylesheet" href="${httpStaticPath + entryPoint}" />`).join('');

  return entryPoints;
}

// __webpack_require__.e = webpack's chunk ensure function.
// .hook and .unhook are methods added by a custom webpack plugin.
let requiredChunks: ?Set = null;
const rjsHook = __webpack_require__.rjs; // eslint-disable-line
function hookWebpackAsyncRequire() {
  requiredChunks = new Set();

  if (!rjsHook) {
    return;
  }

  rjsHook.hook(onRequiredModule);
}

function onRequiredModule(chunkId) {
  requiredChunks.add(chunkId);
}

function unhookWebpackAsyncRequire() {
  if (rjsHook) {
    rjsHook.unhook(onRequiredModule);
  }

  return requiredChunks;
}

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        return void reject(err);
      }

      resolve(data);
    });
  });
}
