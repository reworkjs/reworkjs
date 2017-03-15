import React from 'react';
import { plugToRequest } from 'react-cookie';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { collectInitial, collectContext } from 'node-style-loader/collect';
import { parse } from 'accept-language-parser';
import { isProd } from '../../../shared/EnvUtil';
import { rootRoute, store } from '../../common/kernel';
import App from '../../app/ReworkJsWrapper';
import setupProd from './setup-prod';
import setupDev from './setup-dev';
import { setRequestLocales } from './request-locale';

export default function setupHttpServer(expressApp) {
  const setup = isProd ? setupProd : setupDev;

  setup(preRenderReactApp, expressApp);
}

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

async function preRenderReactApp(req, res): ?{ appHtml: string, state: Object, style: string } {

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

  const unplugReactCookie = plugToRequest(req, res);

  const initialStyleTag = collectInitial();
  const [contextStyleTag, appHtml] = collectContext(() => renderToString(
    <App>
      <RouterContext {...props} />
    </App>,
  ));

  const styleTags = initialStyleTag + contextStyleTag;

  unplugReactCookie();

  return {
    appHtml: `<div>${appHtml}</div>`,
    state: store.getState(),
    style: styleTags,
  };
}
