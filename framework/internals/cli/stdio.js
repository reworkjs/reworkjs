import readLine from 'readline';
import { ColoredLogger } from '../../common/logger/server';

const logger = new ColoredLogger('cli');

export function info(str) {
  logger.info(str);
}

export function warn(str) {
  logger.warn(str);
}

export function question(str) {
  const stdin: readLine.Interface = readLine.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    stdin.question(str, resolve);
    stdin.close();
  });
}
