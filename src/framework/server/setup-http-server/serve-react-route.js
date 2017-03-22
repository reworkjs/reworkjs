import fs from 'fs';
import React from 'react';
import { plugToRequest as plugReactCookie } from 'react-cookie';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { collectInitial, collectContext } from 'node-style-loader/collect';
import { parse } from 'accept-language-parser';
import getWebpackSettings from '../../../shared/webpack-settings';
import { rootRoute, store } from '../../common/kernel';
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

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;

export default async function serveReactRoute(req, res, next): ?{ appHtml: string, state: Object, style: string } {

  try {
    const { redirect, props } = await matchAsync([rootRoute], req.url);

    if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
      return null;
    }

    if (!props) {
      res.status(404).send('This is a 404 page. To define the page to actually render when a 404 occurs, please create a new route object and set its "status" property to 404 (int)');
      return null;
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

    const unplugReactCookie = plugReactCookie(req, res);

    const entryPoints = await getEntryPoints();

    const initialStyleTag = entryPoints.css
      ? entryPoints.css
      : collectInitial();

    const [contextStyleTag, appHtml] = collectContext(() => renderToString(
      <ReworkJsWrapper>
        <RouterContext {...props} />
      </ReworkJsWrapper>,
    ));

    unplugReactCookie();

    res.send(renderPage({
      // initial react app
      body: appHtml,

      // initial style
      header: initialStyleTag + contextStyleTag,

      // initial redux state + webpack bundle
      footer: `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())}</script>${entryPoints.js}`,
    }));
  } catch (e) {
    next(e);
  }
}

let entryPointCache;
function getEntryPoints() {
  if (entryPointCache) {
    return entryPointCache;
  }

  return new Promise((resolve, reject) => {
    fs.readFile(`${fsClientOutputPath}-entrypoints.json`, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      const entryPoints = buildEntryPointTags(JSON.parse(data));

      if (process.env.NODE_ENV === 'production') { // eslint-disable-line no-process-env
        entryPointCache = entryPoints;
      }

      resolve(entryPoints);
    });
  });
}

function buildEntryPointTags(entryPoints) {
  // httpStaticPath
  entryPoints.js = entryPoints.js.map(entryPoint => `<script src="${httpStaticPath}${entryPoint}"></script>`).join('');
  entryPoints.css = entryPoints.css.map(entryPoint => `<link rel="stylesheet" href="${httpStaticPath}${entryPoint}" />`).join('');

  return entryPoints;
}
