import readLine from 'readline';
import logger from '../../shared/logger';

export function info(str) {
  logger.info(str);
}

export function warn(str) {
  logger.warn(str);
}

export function error(str) {
  logger.error(str);
}

export function question(str) {
  const stdin: readLine.Interface = readLine.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    stdin.question(str, resolve);
    stdin.close();
  });
}
