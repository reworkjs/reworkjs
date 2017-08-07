import React from 'react';
import ReactDOM from 'react-dom';
import { applyRouterMiddleware, Router } from 'react-router';
import { CookiesProvider } from 'react-cookie';
import serverStyleCleanup from 'node-style-loader/clientCleanup';
import { useScroll } from 'react-router-scroll';
import ReworkJsWrapper from '../app/ReworkJsWrapper';
import { rootRoute, history } from '../common/kernel';

ReactDOM.render(
  <CookiesProvider>
    <ReworkJsWrapper>
      <Router
        history={history}
        routes={rootRoute}
        render={

          // Scroll to top when going to a new page, imitating default browser behaviour
          applyRouterMiddleware(useScroll())
        }
      />
    </ReworkJsWrapper>
  </CookiesProvider>,
  document.getElementById('app'),
);

// remove server-generated CSS
serverStyleCleanup();
