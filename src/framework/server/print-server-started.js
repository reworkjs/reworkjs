import ip from 'ip';
import chalk from 'chalk';
import logger from '../../shared/logger';

chalk.enabled = true;

const divider = chalk.gray('\n\t-----------------------------------');

export default function printServerStarted(port, tunnelUrl) {
  logger.info(`Server started ${chalk.green('✓')}`);

  // If the tunnel started, log that and the URL it's available at
  if (tunnelUrl) {
    logger.info(`Tunnel initialised ${chalk.green('✓')}`);
  }

  console.info(`
\t${chalk.bold('Access URLs:')}${divider}
\tLocalhost: ${chalk.magenta(`http://localhost:${port}`)}
\t      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) + (tunnelUrl ? `\n\t    Proxy: ${chalk.magenta(tunnelUrl)}` : '')}${divider}
\t${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
}
