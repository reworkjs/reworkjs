import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import getFilenameFromUrl from 'webpack-dev-middleware/lib/GetFilenameFromUrl';
import getWebpackSettings from '../../../shared/webpack-settings';
import logger from '../../../shared/logger';
import buildPage from './build-page';

const webpackClientConfig = getWebpackSettings(/* is server */ false);
const httpStaticPath = webpackClientConfig.output.publicPath;
const fsClientOutputPath = webpackClientConfig.output.path;

export default function setupDevServer(preRenderReactApp, expressApp) {

  expressApp.use((req, res) => {

    const fileName = getFilenameFromUrl(httpStaticPath, fsClientOutputPath, req.url);

    // pre-renderer root route rather than giving index.html.
    if (!fileName || fileName === fsClientOutputPath) {
      return renderRoute(req, res, preRenderReactApp);
    }

    isReadable(fileName, readable => {
      if (readable) {
        return serveStaticFile(res, fileName);
      }

      return renderRoute(req, res, preRenderReactApp);
    });
  });
}

/**
 * Server-side rendering
 */
async function renderRoute(req, res, preRenderReactApp) {

  logger.debug(`pre-rendering app for route ${JSON.stringify(req.url)}`);

  const clientEntryPoint = path.join(fsClientOutputPath, 'index.html');
  let renderedApp;
  try {
    renderedApp = await preRenderReactApp(req, res);
  } catch (e) {
    logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
    logger.error(e);

    res.status(e.status || 500);
    return serveStaticFile(res, clientEntryPoint);
  }

  if (renderedApp == null) {
    return;
  }

  fs.readFile(clientEntryPoint, async (err, file) => {
    if (err) {
      return res.status(500).send('Missing file "index.html". Either the app is still building or something went wrong.');
    }

    const $doc = cheerio(file.toString());
    buildPage($doc, renderedApp);

    res.send($doc.toString());
  });
}

function isReadable(file, cb) {
  fs.access(file, fs.constants.R_OK, err => cb(!err));
}

function serveStaticFile(res, file) {
  res.sendFile(file);
}
