import levels from './levels';

class Logger {}

for (const levelName: string of Object.keys(levels)) {
  // const levelImportance = levels[levelName];
  const loggingMethod = console[levelName.toLocaleLowerCase()] || console.log; // eslint-disable-line no-console

  Logger.prototype[levelName] = function logMessage(...args) {
    loggingMethod.call(console, `[${levelName}]`, ...args);
  };
}

export default new Logger();
