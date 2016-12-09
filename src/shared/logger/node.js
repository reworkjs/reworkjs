import winston from 'winston';
import globals from '../globals';
import argv from '../argv';

const levels = {
  trace: 9,
  input: 8,
  verbose: 7,
  prompt: 6,
  debug: 5,
  info: 4,
  data: 3,
  help: 2,
  warn: 1,
  error: 0,
};

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
