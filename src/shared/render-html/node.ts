import frameworkConfig from '@reworkjs/core/_internal_/framework-config';
import logger from '@reworkjs/core/logger';
import defaultRenderPage from '../../framework/server/setup-http-server/default-render-page.js';
import type { RenderPageFunction } from '../../framework/server/setup-http-server/render-page.js';
import { getDefault } from '../util/module-util.js';

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
