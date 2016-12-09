import compression from 'compression';
import express from 'express';
import webpackConfig from '../../../../shared/webpack/webpack.client';
import compileWebpack from '../../../../shared/compile-webpack';

const htmlEntryPoint = `${webpackConfig.output.path}/index.html`;

export default class ProdMiddleware {
  constructor(app, config) {
    this.app = app;
    this.config = config;

    this.ready = false;
    compileWebpack(webpackConfig, false, () => {
      this.ready = true;
    });
  }

  registerMiddlewares() {
    const app = this.app;
    const config = this.config;

    // compression middleware compresses your server responses which makes them
    // smaller (applies also to assets).
    app.use(compression());
    app.use(config.publicPath, express.static(webpackConfig.output.path));
  }

  serveRoute(req, res, html) {
    if (!this.ready) {
      res.send('Application building...');
      return;
    }

    if (typeof html === 'string') {
      // TODO
      console.log(html); // eslint-disable-line
    }

    return res.sendFile(htmlEntryPoint);
  }
}
