import React from 'react';
import ReactDOM from 'react-dom';
import { applyRouterMiddleware, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';
import App from '../app/App';
import { rootRoute, history } from '../common/kernel';

ReactDOM.render(
  <App>
    <Router
      history={history}
      routes={rootRoute}
      render={
        // Scroll to top when going to a new page, imitating default browser behaviour
        applyRouterMiddleware(useScroll())
      }
    />
  </App>,
  document.getElementById('root'),
);
