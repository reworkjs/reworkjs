import * as Chalk from 'chalk';

export const chalk = new Chalk.constructor({ enabled: true });

// Chalk Theme

/* STDIN argv, eg. --port=3000 */
export const chalkArgvParam = chalk.blue;

/* Environment variable name, eg. NODE_ENV */
export const chalkEnvVar = chalk.magenta;

/* A CLI command, eg "npm install" */
export const chalkCommand = chalk.magenta;

/* A URL or Path, eg "/static" */
export const chalkUrl = chalk.blue;

/* A status OK */
export const chalkOk = chalk.green;

/* A status Not OK */
export const chalkNok = chalk.red;

/* The name of an NPM package */
export const chalkNpmDep = chalk.blue;

// --

/* The name of a webpack feature */
export const chalkWebpackFeature = chalk.blue;
