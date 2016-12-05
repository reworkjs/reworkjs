import compression from 'compression';
import express from 'express';
import webpackConfig from '../../../../shared/webpack/webpack.client';
import compileWebpack from '../../../../shared/compile-webpack';

export default function addProdMiddlewares(app, config) {

  let ready = false;
  compileWebpack(webpackConfig, false, () => {
    ready = true;
  });

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets).
  app.use(compression());
  app.use(config.publicPath, express.static(webpackConfig.output.path));

  const htmlEntryPoint = `${webpackConfig.output.path}/index.html`;
  return function serveRoute(req, res, html) {
    if (!ready) {
      res.send('Application building...');
      return;
    }

    if (typeof html === 'string') {
      console.log(html); // eslint-disable-line
    }

    return res.sendFile(htmlEntryPoint);
  };
}
