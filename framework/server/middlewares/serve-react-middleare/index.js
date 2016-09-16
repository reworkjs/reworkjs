// import React from 'react';
// import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../../../common/routes';
import { isProd } from '../../../util/EnvUtil';
import prod from './prod';
import dev from './dev';

export default function frontEndMiddleware(app, options) {

  process.env.BABEL_ENV = `${process.env.NODE_ENV}-webpack`;

  const serveRoute = isProd ? prod(app, options) : dev(app, options);

  function serveReact(req, res) {
    match({ routes, location: req.url }, (err, redirect, props) => {

      if (err) {
        return res.status(500).send(err.message);
      }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search);
      }

      if (props) {
        // const appHtml = renderToString(<RouterContext {...props} />);
        return serveRoute(req, res);
      }

      res.status(404).send('Not Found');
    });
  }

  app.use(serveReact);
}
