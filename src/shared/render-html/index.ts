// @flow

import defaultRenderPage from '../../framework/server/setup-http-server/default-render-page';
import type { RenderPageFunction } from '../../framework/server/setup-http-server/render-page';
import frameworkConfig from '../framework-config';
import logger from '../logger';
import { getDefault } from '../util/ModuleUtil';

export default function loadRenderPage(): RenderPageFunction {
  const rendererFile = frameworkConfig['render-html'];
  if (!rendererFile) {
    return defaultRenderPage;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return getDefault(require(rendererFile));
  } catch (e) {
    logger.error(`Error while loading HTML renderer script ${rendererFile}`);
    throw e;
  }
}
