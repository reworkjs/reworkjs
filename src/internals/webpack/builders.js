import path from 'path';

const builders = {
  client: path.join(__dirname, 'build-webpack-client.js'),
  server: path.join(__dirname, 'build-webpack-server.js'),
};

export default builders;
