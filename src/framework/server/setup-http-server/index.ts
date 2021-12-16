import path from 'path';
import logger from '@reworkjs/core/logger';
import type { Express, Response, Request, NextFunction } from 'express';
import express from 'express';
import cookiesMiddleware from 'universal-cookie-express';
import argv from '../../../internals/rjs-argv.js';
import { getDefault } from '../../../shared/util/module-util.js';
import getWebpackSettings from '../../../shared/webpack-settings.js';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;
const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');

const HAS_PRERENDERING = argv.ssr === true;

export default function setupHttpServer(expressApp: Express) {

  expressApp.use(httpStaticPath, express.static(fsClientOutputPath, {
    index: HAS_PRERENDERING ? false : 'index.html',
  }));

  expressApp.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
    logger.error(err);

    res.status(err.status || 500);

    return res.sendFile(clientEntryPoint);
  });

  if (!HAS_PRERENDERING) {
    expressApp.use((_req: Request, res: Response) => {
      res.sendFile(clientEntryPoint);
    });
  } else {

    // lazy-imported because these can only run on the built server
    import('../server-hooks/index.js').then(module => {
      const ServerHooks = module.default;
      const serverHookClasses = ServerHooks.map(hookModule => getDefault(hookModule));

      for (const serverHookClass of serverHookClasses) {
        if (serverHookClass.configureServerApp) {
          serverHookClass.configureServerApp(expressApp);
        }
      }
    }).then(async () => {
      return import('./serve-react-route.js').then(module => {
        const serveReactRoute = getDefault(module);

        expressApp.use(cookiesMiddleware());
        expressApp.use(serveReactRoute);
      });
    });
  }
}
