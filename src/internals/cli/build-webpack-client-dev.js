import fs from 'fs';
import path from 'path';
import express from 'express';
import httpProxy from 'http-proxy';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import printServerStarted from '../../framework/server/print-server-started';
import webpackClientConfig from '../../shared/webpack/webpack.client';
import logger from '../../shared/logger';
import argv from '../../shared/argv';

const PRERENDERING_PORT = argv['prerendering-port'];
const HAS_PRERENDERING = Boolean(PRERENDERING_PORT);

const app = express();
let preRenderingHandler;

if (HAS_PRERENDERING) {
  // Note: the reason there is two servers is that they are built independently.
  // No worries though, this only happens in dev mode with pre-rendering.
  // Only one server is launched in prod mode or without pre-rendering.

  const proxy = httpProxy.createProxyServer();
  const preRenderingServer = `http://localhost:${PRERENDERING_PORT}`;

  preRenderingHandler = (req, res) => {
    logger.debug(`Got request for ${JSON.stringify(req.url)}. Not a static file - dispatching to server-side rendering.`);

    return proxy.web(req, res, {
      target: preRenderingServer,
    });
  };

  // dispatch root route to pre-rendering rather than distributing index.html
  app.all('/', preRenderingHandler);
}

// build & serve static files
const compiler = webpack(webpackClientConfig);

const wdmInstance = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackClientConfig.output.publicPath,
  silent: true,
  stats: 'errors-only',
  serverSideRender: HAS_PRERENDERING,
});
app.use(wdmInstance);

app.use(webpackHotMiddleware(compiler, {
  log: logger.info.bind(logger),
}));

const indexFileName = path.join(webpackClientConfig.output.path, 'index.html');
if (HAS_PRERENDERING) {
  // WDM uses an in-memory file system, we need to
  // persist index.html to the real file system because it will be used by the pre-rendering server.
  compiler.plugin('done', () => {
    const memoryFs = wdmInstance.fileSystem;

    memoryFs.readFile(indexFileName, (readError, file) => {
      if (readError) {
        fs.unlink(file);
      } else {
        fs.writeFile(indexFileName, file, writeError => {
          if (writeError) {
            logger.error('error writing index.html');
            logger.error(writeError);
          } else {
            logger.trace('index.html persisted');
          }
        });
      }
    });
  });

  // redirect requests for non-static documents to the pre-rendering server.
  app.use(preRenderingHandler);

} else {
  // send index.html for all not found routes.
  app.use((req, res) => {
    const readStream = wdmInstance.fileSystem.createReadStream(indexFileName);
    readStream.pipe(res);
  });
}

app.listen(argv.port, () => {
  printServerStarted(argv.port);
});
