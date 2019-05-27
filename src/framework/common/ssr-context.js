// @flow

import React from 'react';
import type { $Request, $Response } from 'express';
import type { ResourceLoader } from './use-async-resource/typing.flow';

type Context = {
  req?: $Request,
  res?: $Response,
  loadableResources?: Map<string, ResourceLoader<any>>,
  persistentValues?: Map<string, any>,
};

/**
 * This context contains the request and response objects of the current HTTP request. Server-side only. (empty object on client side).
 */
// eslint-disable-next-line space-infix-ops
export const SsrContext = React.createContext<Context>(Object.freeze({}));
