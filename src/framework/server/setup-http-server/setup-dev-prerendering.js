import fs from 'fs';
import cheerio from 'cheerio';
import logger from '../../../shared/logger';
import buildPage from './build-page';
import renderReactApp from './render-react';

export default function setupDevServerPrerendering(expressApp, { clientEntryPoint }) {

  expressApp.use(async (req, res) => {
    let renderedApp;
    try {
      renderedApp = await renderReactApp(req, res);

      // redirection
      if (renderedApp == null) {
        return;
      }
    } catch (e) {
      logger.error(`renderApp: Serving "${req.url}" crashed, trying without server-side rendering.`);
      logger.error(e);

      res.status(e.status || 500);
      return res.sendFile(clientEntryPoint);
    }

    try {
      const $indexFile = cheerio(await readFile(clientEntryPoint));
      res.send(buildPage($indexFile, renderedApp));
    } catch (e) {
      return res.status(500).send('Missing file "index.html". Either the app is still building or something went wrong.');
    }
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
