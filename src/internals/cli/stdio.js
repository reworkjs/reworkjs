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
  return new Promise(resolve => {
    const stdin: readLine.Interface = readLine.createInterface({ input: process.stdin, output: process.stdout });
    stdin.question(str, response => {
      stdin.close();
      resolve(response);
    });
  });
}
