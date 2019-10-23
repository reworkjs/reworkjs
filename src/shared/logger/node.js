import winston from 'winston';
import argv from '../../internals/rjs-argv';
import framework from '../framework-metadata';
import { getDefault } from '../util/ModuleUtil';
import levels from './levels';

let requestedLevel;
if (typeof argv.verbose === 'string') {
  requestedLevel = argv.verbose.toLocaleLowerCase();
} else if (argv.verbose === true) {
  requestedLevel = 'debug';
} else {
  requestedLevel = 'info';
}

const actualLevel = Object.keys(levels).includes(requestedLevel) ? requestedLevel : 'info';

const logger = winston.createLogger({ levels });

logger.add(new winston.transports.Console({
  level: actualLevel,
  name: process.env.PROCESS_NAME || 'FrameworkCli',
  stderrLevels: ['error'],
  consoleWarnLevels: ['warn'],
  silent: false,
  format: winston.format.combine(
    winston.format(info => {
      info.level = info.level.toUpperCase();

      return info;
    })(),
    winston.format.colorize({
      colors: {
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red',
      },
    }),
    winston.format.splat(),
    winston.format.errors(),
    winston.format.printf(({ level, message, ...rest }) => {
      let restString = JSON.stringify(rest, void 0, 2);
      restString = restString === '{}' ? '' : restString;

      return `${level} - ${message} ${restString}`;
    }),
  ),
}));

if (actualLevel !== requestedLevel) {
  logger.warn(`Invalid --verbose value ${JSON.stringify(requestedLevel)}, must be one of "${Object.keys(levels).join('", "')}". Using "${actualLevel}" instead.`);
}

export default logger;

// needs to be loaded after logger because the config builder uses the logger.
import('../framework-config').then(config => {
  config = getDefault(config);

  logger.add(new winston.transports.File({
    level: actualLevel,
    silent: false,
    filename: `${config.directories.log}/${framework.name}.log`,
    maxsize: 40000,
    maxFiles: 10,
  }));
});
