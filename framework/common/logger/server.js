import chalk from 'chalk';
import Logger from './Logger';

export class ColoredLogger extends Logger {

  prepareMessage(msg, level) {
    msg = super.prepareMessage(msg, level);

    switch (level) {
      case Logger.LEVELS.INFO:
        return chalk.blue(msg);

      case Logger.LEVELS.WARN:
        return chalk.yellow(msg);

      case Logger.LEVELS.ERROR:
        return chalk.red(msg);

      default:
        return msg;
    }
  }
}

export default new ColoredLogger('server');
