import logger from '@reworkjs/core/logger';
import type { ComponentType } from 'react';
import { Route } from 'react-router-dom';
import routeDefinitions from 'val-loader!./_find-routes.codegen.cjs';
import Dev404Loadable from './dev-404.loadable.cjs';

const SourceFileName = Symbol('sourceFileName');

type TRouteDef = {
  path: string,
  component: ComponentType<any>,
  status?: number,
  priority?: number,
  toJSON?(): TRouteDef,

  // for development
  [SourceFileName]?: string,
};

export default function createRoutes() {

  const fileNames = routeDefinitions.__debugFileNames || [];

  if (routeDefinitions.length === 0) {
    logger.warn('Your framework does not contain any route. Create a file matching your "route" glob as defined in your configuration file.');
  }

  const routes: TRouteDef[] = routeDefinitions
    .map((route: TRouteDef, i: number) => {
      if (route == null || typeof route !== 'object') {
        return null;
      }

      if (typeof route.toJSON === 'function') {
        route = route.toJSON() || route;
      }

      route = Object.assign({}, route);
      route[SourceFileName] = fileNames[i];

      if (route.status === 404) {
        route.priority = route.priority || Number.MIN_SAFE_INTEGER + 2;
        route.path = route.path || '*';
      }

      if (route.status && Math.floor(route.status / 100) !== 2) {
        route.priority = route.priority || Number.MIN_SAFE_INTEGER + 1;
        route.path = route.path || '*';
      }

      return route;
    });

  if (process.env.NODE_ENV === 'development') {
    // dev 404 route
    routes.push({
      path: '*',
      priority: Number.MIN_SAFE_INTEGER + 2,
      status: 404,
      component: Dev404Loadable,
    });
  }

  return routes
    .filter(route => route !== null)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .map(route => sanitizeRoute(route, route[SourceFileName]));
}

function sanitizeRoute(routeData: TRouteDef, _fileName?: string) {
  // TODO: support `status`

  return <Route {...routeData} key={routeData.path} />;
}
