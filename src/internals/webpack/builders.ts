import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const builders = {
  client: join(__dirname, 'build-webpack-client.js'),
  server: join(__dirname, 'build-webpack-server.js'),
};

export default builders;
