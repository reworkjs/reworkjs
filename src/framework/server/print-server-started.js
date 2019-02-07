import ip from 'ip';
import chalk from 'chalk';

chalk.enabled = true;

const divider = chalk.gray('\n\t-----------------------------------');

export default function printServerStarted(port) {

  console.info(`
\t${chalk.bold('Access URLs:')}${divider}
\tLocalhost: ${chalk.magenta(`http://localhost:${port}`)}
\t      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}${divider}
\t${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
}
