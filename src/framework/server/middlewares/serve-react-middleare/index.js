import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { isProd } from '../../../../shared/EnvUtil';
import { rootRoute } from '../../../common/kernel';
import App from '../../../app/App';
import prod from './prod';
import dev from './dev';

export default function frontEndMiddleware(app, options) {

  const serveRoute = isProd ? prod(app, options) : dev(app, options);

  function serveReact(req, res) {
    match({ routes: [rootRoute], location: req.url }, (err, redirect, props) => {

      if (err) {
        return res.status(500).send(err.message);
      }

      if (redirect) {
        return res.redirect(redirect.pathname + redirect.search);
      }

      if (props) {
        // TODO use react helmet here.
        // https://github.com/nfl/react-helmet#as-react-components
        const appHtml = renderToString(
          <App>
            <RouterContext {...props} />
          </App>,
        );

        return serveRoute(req, res, appHtml.replace('&#x27;', '\''));
      }

      res.status(404).send('No route defined for path');
    });
  }

  app.use(serveReact);
}
