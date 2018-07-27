import React from 'react';
import ReactDOM from 'react-dom';
import { applyRouterMiddleware, Router } from 'react-router';
import { CookiesProvider } from 'react-cookie';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import { useScroll } from 'react-router-scroll';
import ReworkRootComponent from '../app/ReworkRootComponent';
import { rootRoute, history } from '../common/kernel';

ReactDOM.render(
  <CookiesProvider>
    <ReworkRootComponent>
      <Router
        history={history}
        routes={rootRoute}
        render={

          // Scroll to top when going to a new page, imitating default browser behaviour
          applyRouterMiddleware(useScroll())
        }
      />
    </ReworkRootComponent>
  </CookiesProvider>,
  document.getElementById('app'),
);

// remove server-generated CSS
serverStyleCleanup();
