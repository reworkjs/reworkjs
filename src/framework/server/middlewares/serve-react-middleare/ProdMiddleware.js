import fs from 'fs';
import express from 'express';
import compression from 'compression';
import cheerio from 'cheerio';
import webpackConfig from '../../../../shared/webpack/webpack.client';
import compileWebpack from '../../../../shared/compile-webpack';
import buildPage from './buildPage';

const htmlEntryPoint = `${webpackConfig.output.path}/index.html`;

export default class ProdMiddleware {
  constructor(app, config) {
    this.app = app;
    this.config = config;

    this.ready = false;
    compileWebpack(webpackConfig, false, () => {
      fs.readFile(htmlEntryPoint, (err, file) => {
        this.index = cheerio(file.toString());
        this.ready = true;
      });
    });
  }

  registerMiddlewares() {
    const app = this.app;
    const config = this.config;

    // compression middleware compresses your server responses which makes them
    // smaller (applies also to assets).
    app.use(compression());

    const staticOptions = {};
    if (this.config.prerendering) {
      staticOptions.index = false;
    }

    app.use(config.publicPath, express.static(webpackConfig.output.path, staticOptions));
  }

  serveRoute(req, res, html, appState) {
    if (!this.ready) {
      res.send('Application building...');
      return;
    }

    // no server-side rendering
    if (typeof html !== 'string') {
      return res.sendFile(htmlEntryPoint);
    }

    // server-side rendering
    const $doc = this.index.clone();
    buildPage($doc, html, appState);
    res.send($doc.toString());
  }
}
