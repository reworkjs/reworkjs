// @flow

import { type RenderPageFunction } from '../../framework/server/setup-http-server/render-page';
import frameworkConfig from '../framework-config';
import logger from '../logger';
import { getDefault } from '../util/ModuleUtil';

export default function loadRenderPage(): ?RenderPageFunction {
  const rendererFile = frameworkConfig['render-html'];
  if (!rendererFile) {
    return null;
  }

  try {
    // -- We need this to be dynamic
    // $FlowIgnore
    return getDefault(require(rendererFile));
  } catch (e) {
    logger.error(`Error while loading HTML renderer script ${rendererFile}`);
    logger.error(e);
    return null;
  }
}
