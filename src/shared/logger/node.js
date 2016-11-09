import winston from 'winston';
import globals from '../globals';

const logger = new (winston.Logger)({
  levels: {
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
  },
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
  level: 'trace',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false,
  label: globals.PROCESS_NAME,
});

logger.add(winston.transports.File, {
  prettyPrint: false,
  level: 'info',
  silent: false,
  colorize: true,
  timestamp: true,
  filename: './.framework.log',
  maxsize: 40000,
  maxFiles: 10,
  json: false,
});

export default logger;
