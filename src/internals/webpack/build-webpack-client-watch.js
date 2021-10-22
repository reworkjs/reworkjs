import fs from 'fs';
import path from 'path';
import express, { type $Response, type $Request } from 'express';
import httpProxy from 'http-proxy';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import printServerStarted from '../../framework/server/print-server-started';
import logger from '../../shared/logger';
import argv from '../rjs-argv';
import webpackClientConfig from './webpack.client';

const PRERENDERING_PORT = argv['ssr-port'];
const HAS_PRERENDERING = Boolean(PRERENDERING_PORT);

const app = express();
let preRenderingHandler;

if (HAS_PRERENDERING) {
  // Note: the reason there is two servers is that they are built independently.
  // No worries though, this only happens in dev mode with pre-rendering.
  // Only one server is launched in prod mode or without pre-rendering.

  const proxy = httpProxy.createProxyServer({
    // target the SSR server (which only outputs HTML in dev as we have the fileSystem)
    target: `http://localhost:${PRERENDERING_PORT}`,
  });

  proxy.on('error', (err, req, res) => {
    res.set('Content-Type', 'text/plain');
    res.status(500).send('Proxy could not contact SSR server. Either it is booting or it crashed (check console).');
  });

  preRenderingHandler = (req: $Request, res: $Response) => {
    logger.debug(`Got request for ${JSON.stringify(req.url)}. Not a static file - dispatching to server-side rendering.`);

    return proxy.web(req, res);
  };

  // dispatch root route to pre-rendering rather than distributing index.html
  app.all('/', preRenderingHandler);
}

// build & serve static files
const compiler = webpack(webpackClientConfig);

const wdmInstance = webpackDevMiddleware(compiler, {
  publicPath: webpackClientConfig.output.publicPath,
  serverSideRender: true,
});

app.use(wdmInstance);
app.use(webpackHotMiddleware(compiler, {
  log: false,
}));

const indexFileName = path.join(webpackClientConfig.output.path, 'index.html');
if (HAS_PRERENDERING) {
  // WDM uses an in-memory file system, we need to
  // persist index.html to the real file system because it will be used by the pre-rendering server.
  compiler.hooks.afterEmit.tap('@reworkjs/core ssr index.html copy', async () => {

    try {
      const memoryFs = wdmInstance.context.compiler.outputFileSystem;

      const indexFile = memoryFs.readFileSync(indexFileName); // memoryFs is always sync
      await fs.promises.writeFile(indexFileName, indexFile);
    } catch (postBuildError) {
      logger.error('Error while persisting index.html for use by SSR server:');
      logger.error(postBuildError.stack);

      try {
        fs.promises.writeFile(indexFileName, `<h1>SSR Application Failed to build</h1><pre>${postBuildError.stack}</pre>`);
      } catch (fallbackError) {
        logger.error('Error while persisting fallback index.html');
        logger.error(fallbackError);
      }
    }
  });

  // redirect requests for non-static documents to the pre-rendering server.
  app.use(preRenderingHandler);

} else {

  const errorMessage = `
  <style>
    body {
      background: #b2102f;
      color: white;
      font-family: 'monospace';
      display: flex;
      align-items: center;
      justify-content: center;
    }
    div {
      max-width: 400px;
      margin: 16px;
    }
  </style>
  <div>
    <h1>Initial Compilation Failed</h1>
    <p>The initial compilation of this application encountered an error.
    See your terminal for more information.</p>
    <p>Refresh this page once the error has been resolved.</p>
  </div>
  `;

  // send index.html for all not found routes.
  app.use((req: $Request, res: $Response) => {
    try {
      const { devMiddleware } = res.locals.webpack;

      const readStream = devMiddleware.outputFileSystem.createReadStream(indexFileName).on('error', () => {
        res.status(500).end(errorMessage);
      });
      readStream.pipe(res);
    } catch (e) {
      console.error(e);
      res.status(500).end(errorMessage);
    }
  });
}

if (!argv.port) {
  throw new TypeError('missing argv --port.');
}

app.listen(argv.port, () => {
  printServerStarted(argv.port);
});
