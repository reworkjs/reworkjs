// @flow

import path from 'path';
import express from 'express';
import cookiesMiddleware from 'universal-cookie-express';
import getWebpackSettings from '../../../shared/webpack-settings';
import argv from '../../../internals/rjs-argv';
import logger from '../../../shared/logger';
import { getDefault } from '../../../shared/util/ModuleUtil';
import ServerHooks from '../server-hooks';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;
const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');

const HAS_PRERENDERING = argv.prerendering === true;

export default function setupHttpServer(expressApp) {

  expressApp.use(httpStaticPath, express.static(fsClientOutputPath, {
    index: HAS_PRERENDERING ? false : 'index.html',
  }));

  expressApp.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
    logger.error(err);

    res.status(err.status || 500);
    return res.sendFile(clientEntryPoint);
  });

  if (!HAS_PRERENDERING) {
    expressApp.use((req, res) => {
      res.sendFile(clientEntryPoint);
    });
  } else {
    const serverHookClasses = ServerHooks.map(hookModule => getDefault(hookModule));

    for (const serverHookClass of serverHookClasses) {
      if (serverHookClass.configureServerApp) {
        serverHookClass.configureServerApp(expressApp);
      }
    }

    import('./serve-react-route').then(module => {
      const serveReactRoute = getDefault(module);

      expressApp.use(cookiesMiddleware());
      expressApp.use(serveReactRoute);
    });
  }
}
