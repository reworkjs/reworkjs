export default class Logger {

  static LEVELS = {
    DEBUG: console.log, // eslint-disable-line no-console
    INFO: console.info,
    WARN: console.warn,
    ERROR: console.error,
  };

  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  info(msg) {
    this.log(`[INFO]  ${msg}`, Logger.LEVELS.INFO);
  }

  warn(msg) {
    this.log(`[WARN]  ${msg}`, Logger.LEVELS.WARN);
  }

  error(msg) {
    this.log(`[ERROR] ${msg}`, Logger.LEVELS.ERROR);
  }

  log(msg, level = Logger.LEVELS.DEBUG) {
    if (typeof level !== 'function') {
      throw new TypeError('Invalid log level');
    }

    level.call(console, this.prepareMessage(msg, level));
  }

  prepareMessage(msg) {
    return `[${this.namespace}] ${msg}`;
  }
}
