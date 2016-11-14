import { resolve } from 'path';
import { GlobalStore } from './type';

const globals: GlobalStore = {
  PROCESS_NAME: 'FrameworkCli',
  SIDE: 'cli',
  PROJECT_DIR: process.cwd(),
  ROOT_DIR: resolve(__dirname, '../../..'),
};

export default globals;
