import ColoredLogger from './ColoredLogger';

export default new ColoredLogger(process.env.NAME || 'framework-node');
