import path from 'path';
import webpack from 'webpack';
import Helmet from 'react-helmet';
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

      // no server-side rendering
      if (typeof html !== 'string') {
        return res.send(file.toString());
      }

      // server-side rendering:
      const $doc = cheerio(file.toString());
      const { htmlAttributes, ...headChildren } = Helmet.rewind();

      const $html = $doc.find('html');
      for (const attributeName of Object.keys(htmlAttributes)) {
        $html.attr(attributeName, htmlAttributes[attributeName]);
      }

      const $head = $doc.find('head');
      const { title, base, ...appendableTags } = headChildren;
      replace($head, 'title', title.toString());
      replace($head, 'base', base.toString());

      // TODO replace meta tags ?

      for (const tagName of Object.keys(appendableTags)) {
        const tag = appendableTags[tagName];
        $head.append(tag.toString());
      }

      $doc.find('#app').append(`<div>${html}</div>`);

      res.send($doc.toString());
    });
  }
}

function replace($head, tagName, newTag) {
  const tag = $head.find(tagName);
  if (tag.length > 0) {
    tag.replaceWith(newTag);
  } else {
    $head.append(newTag);
  }
}
