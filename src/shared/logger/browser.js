import Logger from './Logger';

export default new Logger(process.env.NAME || 'framework-client');
