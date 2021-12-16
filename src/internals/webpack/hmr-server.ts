/*
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * Author Tobias Koppers @sokra
 * Adapted for reworkjs by Guylian Cox <gc@madkings.com> to make the process notify the parent it needs to be reloaded.
 */

import logApplyResults from 'webpack/hot/log-apply-result';

if (!import.meta.webpackHot) {
  throw new Error('[HMR] Hot Module Replacement is disabled.');
}

process.on('SIGUSR2', () => {
  if (import.meta.webpackHot.status() !== 'idle') {
    console.warn(`[HMR] Got signal but currently in ${import.meta.webpackHot.status()} state.`);
    console.warn('[HMR] Need to be in idle state to start hot update.');

    return;
  }

  checkForUpdate();
});

function checkForUpdate(fromUpdate) {
  import.meta.webpackHot.check().then(async updatedModules => {
    if (!updatedModules && fromUpdate) {
      console.info('[HMR] Update applied.');

      return;
    }

    await import.meta.webpackHot.apply({
      ignoreUnaccepted: true,
      onUnaccepted(data) {
        console.warn(`Ignored an update to unaccepted module ${data.chain.join(' -> ')}`);
      },
    }).then(renewedModules => {
      logApplyResults(updatedModules, renewedModules);

      if (renewedModules.length < updatedModules.length) {
        return tryRestart();
      }

      return checkForUpdate(true);
    });
  }).catch(async err => {
    const status = import.meta.webpackHot.status();
    if (['abort', 'fail'].includes(status)) {
      console.warn('[HMR] Cannot apply update.');
      console.warn(`[HMR] ${err.stack}` || err.message);
      console.warn('[HMR] You need to restart the application!');
    }

    console.warn(`[HMR] Update failed: ${err.stack}` || err.message);

    return tryRestart();
  });
}

async function tryRestart() {
  if (!process.send) {
    return Promise.resolve();
  }

  console.info('[HMR]');
  console.info('[HMR] Press any key to restart...');
  console.info('[HMR]');

  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise(resolve => {

    process.stdin.on('data', () => {
      process.send({
        cmd: 'restart',
      });

      resolve();
    });
  });
}
