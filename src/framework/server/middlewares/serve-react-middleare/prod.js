import compression from 'compression';
import express from 'express';
import webpackConfig from '../../../../shared/webpack/webpack.client';
import compileWebpack, { StatDetails, EntryPoint } from '../../../../shared/compile-webpack';

export default function addProdMiddlewares(app, config) {

  let ready = false;
  compileWebpack(webpackConfig, false, (stats: StatDetails) => {
    const entryPoints: EntryPoint = stats.entrypoints.main.assets.filter(fileName => fileName.endsWith('.js'));

    ready = true;
  });

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets).
  app.use(compression());
  app.use(config.publicPath, express.static(config.outputPath));

  // TODO mechanism for 404, 500, ... routes.
  return function serveRoute(req, res, html) {
    if (!ready) {
      res.send('Application building...');
      return;
    }

    // return (req, res) => res.sendFile(resolveProject(frameworkConfig['entry-html']));
    throw new Error('NYI');
  };
}
