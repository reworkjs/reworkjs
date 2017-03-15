import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import getFilenameFromUrl from 'webpack-dev-middleware/lib/GetFilenameFromUrl';
import webpackClientConfig from '../../../shared/webpack/webpack.client';
import logger from '../../../shared/logger';
import buildPage from './build-page';

export default function setupDevServer(preRenderReactApp, expressApp) {

  expressApp.use((req, res) => {
    const httpStaticPath = webpackClientConfig.output.publicPath;
    const clientOutputPath = webpackClientConfig.output.path;

    const fileName = getFilenameFromUrl(httpStaticPath, clientOutputPath, req.url);

    // serve static assets if they exist
    // FIXME compiler.outputPath will be served statically as-is.
    if (fileName && fileName !== clientOutputPath) {
      return serveStaticFile(res, fileName);
    }

    logger.debug(`pre-rendering app for ${JSON.stringify(req.url)}`);

    // server-side rendering:
    const clientEntryPoint = path.join(clientOutputPath, 'index.html');
    fs.readFile(clientEntryPoint, (err, file) => {
      if (err) {
        return res.status(500).send('Missing file "index.html". Either the app is still building or something went wrong.');
      }

      try {
        const renderedApp = preRenderReactApp(req, res);

        const $doc = cheerio(file.toString());
        buildPage($doc, renderedApp);
        return res.send($doc.toString());
      } catch (e) {
        logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
        logger.error(e);

        res.status(e.status || 500);

        return serveStaticFile(res, clientEntryPoint);
      }
    });
  });
}

function serveStaticFile(res, file) {
  res.sendFile(file);
}
