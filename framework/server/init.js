import minimist from 'minimist';
import express from 'express';
import ngrok from 'ngrok';
import { isDev } from '../util/EnvUtil';
import { resolveProject } from '../util/RequireUtil';
import frameworkConfig from './framework-config';
import logger from './logger';
import serveReactMiddleware from './middlewares/serve-react-middleare';

const argv = minimist(process.argv.slice(2));
const app = express();

// public resources directory
app.use(express.static(resolveProject(frameworkConfig.directories.resources)));

serveReactMiddleware(app, {
  outputPath: resolveProject(frameworkConfig.directories.build),
  publicPath: '/',
});

const port = argv.port || process.env.PORT || 3000;
app.listen(port, onListen);

function onListen(err) {
  if (err) {
    logger.error(err);
    return;
  }

  const enableNgrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel;
  if (!enableNgrok) {
    logger.appStarted(port);
    return;
  }

  ngrok.connect(port, (innerErr, url) => {
    if (innerErr) {
      logger.error(innerErr);
      return;
    }

    logger.appStarted(port, url);
  });
}
