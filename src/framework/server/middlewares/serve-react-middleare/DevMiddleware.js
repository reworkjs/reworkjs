import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import getFilenameFromUrl from 'webpack-dev-middleware/lib/GetFilenameFromUrl';
import webpackHotMiddleware from 'webpack-hot-middleware';
import cheerio from 'cheerio';
import webpackConfig from '../../../../shared/webpack/webpack.client';
import logger from '../../../../shared/logger';

// TODO dllPlugin
// if (dllPlugin) {
//   app.get(/\.dll\.js$/, (req, res) => {
//     const filename = req.path.replace(/^\//, '');
//     res.sendFile(path.join(process.cwd(), dllPlugin.path, filename));
//   });
// }

export default class DevMiddleware {

  constructor(app, config) {
    this.app = app;
    this.config = config;

    this.compiler = webpack(webpackConfig);
    this.middleware = webpackDevMiddleware(this.compiler, {
      noInfo: true,
      publicPath: config.publicPath,
      silent: true,
      stats: 'errors-only',
      serverSideRender: true,
    });
  }

  registerMiddlewares(renderRoute) {
    const config = this.config;
    const compiler = this.compiler;
    const app = this.app;

    if (config.prerendering) {
      // Bypass serving index.html statically to enable server-side rendering.
      this.app.use((req, res, next) => {
        const fileName = getFilenameFromUrl(config.publicPath, compiler.outputPath, req.url);

        if (!fileName) {
          return next();
        }

        if (fileName === compiler.outputPath) {
          return renderRoute(req, res, next);
        }

        next();
      });
    }

    app.use(this.middleware);
    app.use(webpackHotMiddleware(compiler, {
      log: logger.info.bind(logger),
    }));
  }

  serveRoute(req, res, html) {
    // Since webpackDevMiddleware uses memory-fs internally to store build
    // artifacts, we use it instead
    const fs = this.middleware.fileSystem;

    fs.readFile(path.join(this.compiler.outputPath, 'index.html'), (err, file) => {
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
  }
}
