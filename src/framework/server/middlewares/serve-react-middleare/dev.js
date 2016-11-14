import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../../../internals/webpack/webpack.client';
import logger from '../../../../shared/logger';

export default function addDevMiddlewares(app) {

  logger.info('Building your client-side app, this might take a minute.');

  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
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
  return function serveRoute(req, res, html = '') {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {

      if (err) {
        res.sendStatus(404);
      } else {
        const pageHtml = file.toString();
        const appHtml = pageHtml.replace('%COMPONENT%', `<div>${html}</div>`);

        res.send(appHtml);
      }
    });
  };
}
