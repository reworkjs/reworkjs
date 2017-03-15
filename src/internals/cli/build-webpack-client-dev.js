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

// build & serve static files
const compiler = webpack(webpackClientConfig);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackClientConfig.output.publicPath,
  silent: true,
  stats: 'errors-only',
  serverSideRender: HAS_PRERENDERING,
}));

app.use(webpackHotMiddleware(compiler, {
  log: logger.info.bind(logger),
}));

if (HAS_PRERENDERING) {

  // redirect requests for non-static documents to the pre-rendering server.
  // Note: the reason there is two servers is that they are built independently.
  // No worries though, this only happens in dev mode with pre-rendering.
  // Only one server is launched in prod mode or without pre-rendering.

  const proxy = httpProxy.createProxyServer();
  const preRenderingServer = `http://localhost:${PRERENDERING_PORT}`;

  app.use((req, res) => {
    logger.debug(`Got request for ${JSON.stringify(req.url)} - dispatching to server-side rendering.`);

    return proxy.web(req, res, {
      target: preRenderingServer,
    });
  });
}

app.listen(argv.port, () => {
  printServerStarted(argv.port);
});
