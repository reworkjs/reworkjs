import path from 'path';
import fs from 'mz/fs';
import express from 'express';
import mime from 'mime';
import getPreferredEncodings from 'negotiator/lib/encoding';
import compression from 'compression';
import cookiesMiddleware from 'universal-cookie-express';
import getWebpackSettings from '../../../shared/webpack-settings';
import argv from '../../../internals/rjs-argv';
import logger from '../../../shared/logger';
import { getDefault } from '../../../shared/util/ModuleUtil';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;
const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');

const HAS_PRERENDERING = argv.prerendering !== false;

function redirectToPreCompressed(root, encodingTransforms = {}) {
  root = path.resolve(root);
  const availableEncodings = Object.keys(encodingTransforms);

  return async function redirect(req, res, next) {
    // req.acceptsEncoding is not powerful enough, and creates a new instance of Accept AND Negociator
    // on every single call. negotiator/lib/encoding.getPreferredEncodings is a pure function, I'm going to use that.
    const encodings = getPreferredEncodings(req.header('Accept-Encoding'), availableEncodings);

    for (const encoding of encodings) {
      const transform = encodingTransforms[encoding];

      // '/test.js' => '/test.js.gz'
      const newPath = transform(req.path);

      // eslint-disable-next-line no-await-in-loop
      const exists = await fs.exists(path.join(root, newPath));
      if (!exists) {
        continue;
      }

      const originalUrl = req.url;
      req.url = transform(originalUrl);
      res.set('Content-Encoding', encoding);

      // express would use the redirected url to set the content-type, which would result in octet-stream.
      setContentType(res, originalUrl);
      break;
    }

    next();
  };
}

export default function setupHttpServer(expressApp) {

  // serve pre-compressed files if they exist.
  if (process.env.NODE_ENV === 'production') {
    // Common Accept-Encoding: gzip, deflate, br
    expressApp.use(httpStaticPath, redirectToPreCompressed(fsClientOutputPath, {
      br: fileName => `${fileName}.br`,
      gzip: fileName => `${fileName}.gz`,
    }));
  }

  expressApp.use(httpStaticPath, express.static(fsClientOutputPath, {
    index: HAS_PRERENDERING ? false : 'index.html',
  }));

  if (process.env.NODE_ENV === 'production') {
    // Compress pre-rendered app
    expressApp.use(compression());
  }

  expressApp.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
    logger.error(err);

    res.status(err.status || 500);
    return res.sendFile(clientEntryPoint);
  });

  if (!HAS_PRERENDERING) {
    expressApp.use((req, res) => {
      res.sendFile(clientEntryPoint);
    });
  } else {
    import('./serve-react-route').then(module => {
      const serveReactRoute = getDefault(module);

      expressApp.use(cookiesMiddleware());
      expressApp.use(serveReactRoute);
    });
  }
}

function setContentType(res, filePath) {
  if (res.getHeader('Content-Type')) {
    return;
  }

  const type = mime.lookup(filePath);

  if (!type) {
    return;
  }

  const charset = mime.charsets.lookup(type);

  res.setHeader('Content-Type', `${type}${charset ? `; charset=${charset}` : ''}`);
}
