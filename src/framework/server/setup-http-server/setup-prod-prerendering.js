import fs from 'fs';
import cheerio from 'cheerio';
import logger from '../../../shared/logger';
import buildPage from './build-page';
import renderReactApp from './render-react';

export default function setupProdServerPrerendering(expressApp, { clientEntryPoint }) {

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

    const $doc = getClientEntryPoint(clientEntryPoint);
    if ($doc == null) {
      return res.status(500).send('Server starting...');
    }

    res.send(buildPage($doc, renderedApp));
  });
}

let $cachedIndexFile = null;
function getClientEntryPoint(filePath) {
  if ($cachedIndexFile) {
    return $cachedIndexFile.clone();
  }

  let entryPoint;
  try {
    entryPoint = fs.readFileSync(filePath);
  } catch (e) {
    return null;
  }

  $cachedIndexFile = cheerio(entryPoint);

  return $cachedIndexFile.clone();
}
