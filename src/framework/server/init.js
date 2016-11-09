import minimist from 'minimist';
import express from 'express';
import ngrok from 'ngrok';
import chalk from 'chalk';
import ip from 'ip';
import { isDev } from '../../shared/EnvUtil';
import logger from '../../shared/logger';
import frameworkConfig from '../../shared/framework-config';
import serveReactMiddleware from './middlewares/serve-react-middleare';

const argv = minimist(process.argv.slice(2));
const app = express();

// public resources directory
app.use(express.static(frameworkConfig.directories.resources));

serveReactMiddleware(app, {
  outputPath: frameworkConfig.directories.build,
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
    printAppStarted();
    return;
  }

  ngrok.connect(port, (innerErr, url) => {
    if (innerErr) {
      logger.error(innerErr);
      return;
    }

    printAppStarted(url);
  });
}

const divider = chalk.gray('\n-----------------------------------');

function printAppStarted(tunnelStarted = false) {
  logger.info(`Server started ${chalk.green('✓')}`);

  // If the tunnel started, log that and the URL it's available at
  if (tunnelStarted) {
    logger.info(`Tunnel initialised ${chalk.green('✓')}`);
  }

  logger.info(`
${chalk.bold('Access URLs:')}${divider}
Localhost: ${chalk.magenta(`http://localhost:${port}`)}
      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) +
  (tunnelStarted ? `\n    Proxy: ${chalk.magenta(tunnelStarted)}` : '')}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
}
