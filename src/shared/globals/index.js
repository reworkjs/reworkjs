import { resolve } from 'path';
import { GlobalStore } from './type';

const globals: GlobalStore = {
  PROCESS_NAME: process.env.PROCESS_NAME || 'FrameworkCli', // eslint-disable-line
  SIDE: 'server',
  PROJECT_DIR: process.cwd(),
  ROOT_DIR: resolve(__dirname, '../../..'),
};

export default globals;
