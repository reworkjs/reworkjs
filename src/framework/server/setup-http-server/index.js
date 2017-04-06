import path from 'path';
import express from 'express';
import compression from 'compression';
import getWebpackSettings from '../../../shared/webpack-settings';
import argv from '../../../shared/argv';
import logger from '../../../shared/logger';
import { getDefault } from '../../../shared/util/ModuleUtil';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;
const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');

const HAS_PRERENDERING = argv.prerendering !== false;

export default function setupHttpServer(expressApp) {

  if (process.env.NODE_ENV === 'production') {
    // Note: if static assets are pre-compressed, move compression() to pre-rendering.
    expressApp.use(compression());
  }

  const staticOptions = {
    index: HAS_PRERENDERING ? false : 'index.html',
  };

  expressApp.use(httpStaticPath, express.static(fsClientOutputPath, staticOptions));

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
    import('./serve-react-route').then(module => {
      const serveReactRoute = getDefault(module);

      expressApp.use(serveReactRoute);
    });
  }
}
