import { Switch } from 'react-router-dom';
import MainComponent from './app-main-component';
import debug from './debug.js';
import createRoutes from './router/create-routes.js';

// Set up the router, wrapping all Routes in the App component

const topLevelRoutes = createRoutes();

debug.topLevelRoutes = topLevelRoutes;

const rootRoute = (
  <MainComponent>
    <Switch>
      {topLevelRoutes}
    </Switch>
  </MainComponent>
);

export { rootRoute };
