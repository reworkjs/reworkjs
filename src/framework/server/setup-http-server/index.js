import path from 'path';
import express from 'express';
import compression from 'compression';
import getWebpackSettings from '../../../shared/webpack-settings';
import argv from '../../../shared/argv';
import { getDefault } from '../../../shared/util/ModuleUtil';
import { isProd } from '../../../shared/EnvUtil';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;
const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');

const HAS_PRERENDERING = argv.prerendering !== false;

export default function setupHttpServer(expressApp) {

  if (isProd) {
    // Note: if static assets are pre-compressed, move compression() to pre-rendering.
    expressApp.use(compression());
  }

  const staticOptions = {
    index: HAS_PRERENDERING ? false : 'index.html',
  };

  expressApp.use(httpStaticPath, express.static(fsClientOutputPath, staticOptions));

  if (!HAS_PRERENDERING) {
    expressApp.use((req, res) => {
      res.sendFile(clientEntryPoint);
    });

    return;
  }

  getPrerenderingModule()
    .then(module => {
      const setupPrerendering = getDefault(module);
      setupPrerendering(expressApp, { clientEntryPoint });
    });
}

function getPrerenderingModule() {
  return isProd ? import('./setup-prod-prerendering') : import('./setup-dev-prerendering');
}
