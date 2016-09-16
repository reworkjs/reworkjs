#!/usr/bin/env node

/* eslint-disable */

require('../.build/internals/cli/index');

// const childProcess = require('child_process');
// const path = require('path');
//
// let bin;
// if (__dirname.endsWith('/bin')) {
//   bin = '../bin';
// } else {
//   bin = childProcess.execSync('npm bin').toString().trim();
// }
//
// try {
//   childProcess.execSync(`${__dirname}/babel-node -- ${__dirname}/../framework/internals/cli ${process.argv.splice(2).join(' ')}`, {
//     stdio: 'inherit'
//   });
// } catch (e) {
//   if (!e.status) {
//     throw e;
//   }
//
//   process.exit(e);
// }
