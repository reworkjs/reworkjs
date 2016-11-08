import Logger from './Logger';

export default new Logger(process.env.PROCESS_NAME || 'framework-client');
