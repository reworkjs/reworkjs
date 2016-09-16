import compression from 'compression';
import express from 'express';
import frameworkConfig from '../../framework-config';
import { resolveProject } from '../../../util/RequireUtil';

export default function addProdMiddlewares(app, { publicPath, outputPath }) {

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  return (req, res) => res.sendFile(resolveProject(frameworkConfig['entry-html']));
}
