import type { Request, Response } from 'express';
import { createContext } from 'react';
import type { ResourceLoader } from './ssr-apis/use-async-resource/typings.js';

type Context = {
  req?: Request,
  res?: Response,
  loadableResources?: Map<string, ResourceLoader<any>>,
  persistentValues?: Map<string, any>,
};

/**
 * This context contains the request and response objects of the current HTTP request. Server-side only. (empty object on client side).
 */
export const SsrContext = createContext<Context>(Object.freeze({}));
