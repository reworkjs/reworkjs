import ip from 'ip';
import { chalk, chalkUrl } from '../../shared/chalk.js';

const divider = chalk.gray('\n\t-----------------------------------');

export default function printServerStarted(port: number): void {

  console.info(`
\t${chalk.bold('Access URLs:')}${divider}
\tLocalhost: ${chalkUrl(`http://localhost:${port}`)}
\t      LAN: ${chalkUrl(`http://${ip.address()}:${port}`)}${divider}
\t${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
}
