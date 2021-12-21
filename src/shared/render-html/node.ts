import frameworkConfig from '@reworkjs/core/_internal_/framework-config';
import logger from '@reworkjs/core/logger';
import defaultRenderPage from '../../framework/server/setup-http-server/default-render-page.js';
import type { RenderPageFunction } from '../../framework/server/setup-http-server/render-page.js';

export default async function loadRenderPage(): Promise<RenderPageFunction> {
  const rendererFile = frameworkConfig['render-html'];
  if (!rendererFile) {
    return defaultRenderPage;
  }

  try {
    const module = await import(rendererFile);

    if (typeof module.default !== 'function') {
      logger.error(`File ${rendererFile} should export a function either as 'module.exports' or using 'export default'`);
    }

    return module.default;
  } catch (e) {
    logger.error(`Error while loading HTML renderer script ${rendererFile}`);
    throw e;
  }
}
