import path from 'path';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
// import webpackConfig from '../../../../internals/webpack/webpack.client';

export default function addDevMiddlewares(app) {

  // const compiler = webpack(webpackConfig);
  // const middleware = webpackDevMiddleware(compiler, {
  //   noInfo: true,
  //   publicPath: webpackConfig.output.publicPath,
  //   silent: true,
  //   stats: 'errors-only',
  // });

  // app.use(middleware);
  // app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  // const fs = middleware.fileSystem;

  // TODO DLLPlugin ?
  // if (dllPlugin) {
  //   app.get(/\.dll\.js$/, (req, res) => {
  //     const filename = req.path.replace(/^\//, '');
  //     res.sendFile(path.join(process.cwd(), dllPlugin.path, filename));
  //   });
  // }

  throw new Error('NYI');
  // return function serveRoute(req, res, html) {
  //   fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
  //     if (err) {
  //       res.sendStatus(404);
  //     } else {
  //       console.info(html);
  //       res.send(file.toString());
  //     }
  //   });
  // };
}
