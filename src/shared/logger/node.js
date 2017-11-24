// @flow

import winston from 'winston';
import argv from '../argv';
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
  label: process.env.PROCESS_NAME || 'FrameworkCli',
});

if (actualLevel !== requestedLevel) {
  logger.warn(`Invalid --verbose value ${JSON.stringify(requestedLevel)}, must be one of "${Object.keys(levels).join('", "')}". Using "${actualLevel}" instead.`);
}

export default logger;

// needs to be loaded after logger because the config builder uses the logger.
import('../framework-config').then(config => {
  config = getDefault(config);

  logger.add(winston.transports.File, {
    prettyPrint: false,
    level: actualLevel,
    silent: false,
    colorize: true,
    timestamp: true,
    filename: `${config.directories.build}/${framework.name}.log`,
    maxsize: 40000,
    maxFiles: 10,
    json: false,
  });
});
