import winston from 'winston';
import argv from '../argv';
import globals from '../globals';
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

const logger = new (winston.Logger)({
  levels,
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
});

logger.add(winston.transports.Console, {
  level: actualLevel,
  prettyPrint: true,
  colorize: true,
  stderrLevels: ['warn', 'error'],
  silent: false,
  timestamp: false,
  label: globals.PROCESS_NAME,
});

logger.add(winston.transports.File, {
  prettyPrint: false,
  level: actualLevel,
  silent: false,
  colorize: true,
  timestamp: true,
  filename: './.framework.log',
  maxsize: 40000,
  maxFiles: 10,
  json: false,
});

if (actualLevel !== requestedLevel) {
  logger.warn(`Invalid verbosity value ${JSON.stringify(requestedLevel)}, must be one of "${Object.keys(levels).join('", "')}". Using "${actualLevel}" instead.`);
}

export default logger;
