import readLine from 'readline';
import chalk from 'chalk';

export function info(str) {
  console.info(chalk.blue(`[info] ${str}`));
}

export function warn(str) {
  console.warn(chalk.yellow(`[warn] ${str}`));
}

export function question(str) {
  const stdin: readLine.Interface = readLine.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    stdin.question(str, resolve);
    stdin.close();
  });
}
