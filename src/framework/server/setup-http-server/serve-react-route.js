// @flow

import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import type { $Request, $Response, NextFunction } from 'express';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';
import { collectInitial, collectContext } from 'node-style-loader/collect';
import accept from '@hapi/accept';
import { getDefault } from '../../../shared/util/ModuleUtil';
import getWebpackSettings from '../../../shared/webpack-settings';
import { rootRoute } from '../../common/kernel';
import ReworkRootComponent from '../../app/ReworkRootComponent';
import { LanguageContext } from '../../common/accept-language-context';
import { SsrContext } from '../../common/ssr-context';
import { loadResource } from '../../common/use-async-resource/load-resource';
import ServerHooks from '../server-hooks';
import renderPage from './render-page';

export default async function serveReactRoute(req: $Request, res: $Response, next: NextFunction): Promise<void> {

  try {
    const serverHooks = ServerHooks.map(hookModule => {
      const HookClass = getDefault(hookModule);

      return new HookClass();
    });

    try {
      const acceptedLanguages = Object.freeze(accept.languages(req.header('Accept-Language')));
      const loadableResources = new Map();
      const persistentValues = new Map();

      let component = (
        <SsrContext.Provider value={Object.freeze({ req, res, loadableResources, persistentValues })}>
          <LanguageContext.Provider value={acceptedLanguages}>
            {/* custom prop injected by universal-cookies */}
            {/* $FlowFixMe */}
            <CookiesProvider cookies={req.universalCookies}>
              <ReworkRootComponent>
                {rootRoute}
              </ReworkRootComponent>
            </CookiesProvider>
          </LanguageContext.Provider>
        </SsrContext.Provider>
      );

      // allow plugins to add components
      for (const serverHook of serverHooks) {
        if (serverHook.wrapRootComponent) {
          component = serverHook.wrapRootComponent(component);
        }
      }

      const [
        appHtml, routingContext,
        chunkExtractor, inlineStyles,
        helmet,
      ] = await renderWithResources(loadableResources, () => {
        /* eslint-disable no-shadow */

        // will be populated by staticRouter
        const routingContext = {};

        const helmetContext = {};

        // will be populated by collectChunks
        const chunkExtractor = new ChunkExtractor({ statsFile: getLoadableStatFile() });

        const finalJsx = chunkExtractor.collectChunks(
          <HelmetProvider context={helmetContext}>
            <StaticRouter location={req.url} context={routingContext}>
              {component}
            </StaticRouter>
          </HelmetProvider>,
        );

        // a bit of a hack: if this is a redirect, don't bother loading resources. (need better way of passing this info)
        if (routingContext.url && routingContext.url !== req.originalUrl) {
          loadableResources.clear();
        }

        // There is no CSS entry point in dev mode
        // so we collect inline CSS and return it
        if (process.env.NODE_ENV === 'development') {
          const initialInlineCss = collectInitial();
          const [contextInlineCss, appHtml] = collectContext(() => renderToString(finalJsx));

          return [appHtml, routingContext, chunkExtractor, initialInlineCss + contextInlineCss, helmetContext];
        }

        const appHtml = renderToString(finalJsx);

        // there is no inline CSS in production
        // important: Helmet must always be called after a render or it will cause a memory leak
        return [appHtml, routingContext, chunkExtractor, '', helmetContext];

        /* eslint-enable no-shadow */
      });

      // Somewhere a `<Redirect>` was rendered
      if (routingContext.url && routingContext.url !== req.originalUrl) {
        return void res.redirect(routingContext.status || 301, routingContext.url);
      }

      if (routingContext.status) {
        res.status(routingContext.status);
      }

      let htmlParts = {

        // initial style & pre-loaded JS
        header: `
          ${chunkExtractor.getLinkTags()}
          ${chunkExtractor.getStyleTags()}
          ${inlineStyles}
        `,

        // initial react app
        body: appHtml,

        // inject main webpack bundle
        footer: chunkExtractor.getScriptTags(),

        helmet,
      };

      // allow plugins to edit HTML (add script, etc) before actual render.
      for (const serverHook of serverHooks) {
        if (serverHook.preRender) {
          htmlParts = serverHook.preRender(htmlParts) || htmlParts;
        }
      }

      // TODO:
      // - get http-equiv meta from Helmet, and send them as actual headers.
      // - add Link preload headers so our reverse proxy can use them for server push.

      // TODO: collect chunks
      // TODO: test if mapping front-back is correct
      // TODO: check if @loadable/babel-plugin needs to be on both ends

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
  }
}

async function renderWithResources(loadableResources, renderApp) {

  let hasNewLoadableResources;
  let lastOutput;

  do {
    hasNewLoadableResources = false;
    lastOutput = renderApp();

    // load all new resources that were collected during this render
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      Array.from(loadableResources.values())
      // eslint-disable-next-line no-loop-func
        .map(async resource => {
          if (resource.status) {
            return;
          }

          // cause re-render
          hasNewLoadableResources = true;
          resource.status = await loadResource(resource.load);
        }),
    );
  } while (hasNewLoadableResources);

  return lastOutput;
}

const clientBuildDirectory = getWebpackSettings(/* is server */ false).output.path;

function getLoadableStatFile() {
  return `${clientBuildDirectory}/loadable-stats.json`;
}
