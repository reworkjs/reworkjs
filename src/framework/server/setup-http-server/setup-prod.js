import fs from 'fs';
import path from 'path';
import express from 'express';
import compression from 'compression';
import cheerio from 'cheerio';
import getWebpackSettings from '../../../shared/webpack-settings';
import logger from '../../../shared/logger';
import argv from '../../../shared/argv';
import buildPage from './build-page';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;
const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');

const HAS_PRERENDERING = argv.prerendering !== false;

export default function setupDevServer(preRenderReactApp, expressApp) {

  expressApp.use(compression());

  const staticOptions = {
    index: !HAS_PRERENDERING,
  };

  expressApp.use(httpStaticPath, express.static(fsClientOutputPath, staticOptions));

  if (!HAS_PRERENDERING) {
    expressApp.use((req, res) => {
      res.sendFile(clientEntryPoint);
    });
  }

  const $indexFile = cheerio(fs.readFileSync(clientEntryPoint));

  expressApp.use(async (req, res) => {
    const $doc = $indexFile.clone();

    let renderedApp;
    try {
      renderedApp = await preRenderReactApp(req, res);
    } catch (e) {
      logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
      logger.error(e);

      res.status(e.status || 500);
      return res.sendFile(clientEntryPoint);
    }

    res.send(buildPage($doc, renderedApp));
  });
}
