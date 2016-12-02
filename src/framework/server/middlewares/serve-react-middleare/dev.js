import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import cheerio from 'cheerio';
import webpackConfig from '../../../../shared/webpack/webpack.client';
import logger from '../../../../shared/logger';

export default function addDevMiddlewares(app, config) {

  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler, {
    log: logger.info.bind(logger),
  }));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  // TODO dllPlugin
  // if (dllPlugin) {
  //   app.get(/\.dll\.js$/, (req, res) => {
  //     const filename = req.path.replace(/^\//, '');
  //     res.sendFile(path.join(process.cwd(), dllPlugin.path, filename));
  //   });
  // }

  // TODO mechanism for 404, 500, ... routes.
  return function serveRoute(req, res, html) {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        return res.sendStatus(404);
      }

      if (typeof html !== 'string') {
        html = '';
      }

      // TODO inject helmet
      const doc = cheerio(file.toString());
      doc.find('#app').append(`<div>${html}</div>`);

      res.send(doc.toString());
    });
  };
}
