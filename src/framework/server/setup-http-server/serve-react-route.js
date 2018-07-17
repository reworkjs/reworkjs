import fs from 'fs';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { collectInitial, collectContext } from 'node-style-loader/collect';
import { parse } from 'accept-language-parser';
import getWebpackSettings from '../../../shared/webpack-settings';
import { rootRoute } from '../../common/kernel';
import ReworkJsWrapper from '../../app/ReworkJsWrapper';
import { setRequestLocales } from './request-locale';
import renderPage from './render-page';

function matchAsync(routes, url) {
  return new Promise((resolve, reject) => {
    try {
      match({ routes, location: url }, (err, redirect, props) => {
        if (err) {
          reject(err);
        } else {
          resolve({ redirect, props });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export default async function serveReactRoute(req, res, next): ?{ appHtml: string, state: Object, style: string } {

  try {
    hookWebpackAsyncRequire();
    const { redirect, props } = await matchAsync([rootRoute], req.url);

    if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
      return;
    }

    if (!props) {
      res.status(404).send('This is a 404 page. To define the page to actually render when a 404 occurs, please create a new route object and set its "status" property to 404 (int)');
      return;
    }

    const matchedRoute = props.routes[props.routes.length - 1];
    if (matchedRoute.status) {
      res.status(matchedRoute.status);
    }

    setRequestLocales(
      parse(req.header('Accept-Language'))
        .map(parsedLocale => {
          let localeStr = parsedLocale.code;

          if (parsedLocale.region) {
            localeStr += `-${parsedLocale.region}`;
          }

          return localeStr;
        }),
    );

    const renderApp = () => renderToString(
      <CookiesProvider cookies={req.universalCookies}>
        <ReworkJsWrapper>
          <RouterContext {...props} />
        </ReworkJsWrapper>
      </CookiesProvider>,
    );

    const compilationStats = await getCompilationStats();

    let header = '';
    let appHtml;
    if (process.env.NODE_ENV === 'development') {
      // There is no CSS entry point in dev mode, generate it with collectInitial/collectContext instead.
      header += collectInitial();
      const renderedApp = collectContext(renderApp);
      header += renderedApp[0]; // 0 = collected CSS
      appHtml = renderedApp[1]; // 1 = rendered HTML
    } else {
      header += compilationStats.client.entryPoints.css;
      appHtml = renderApp();
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

    res.send(renderPage({

      // initial react app
      body: appHtml,

      // initial style & pre-loaded JS
      header,

      // inject main webpack bundle
      footer: `${compilationStats.client.entryPoints.js}`,
    }));
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
