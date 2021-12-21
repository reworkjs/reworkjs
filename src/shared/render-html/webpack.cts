import type { RenderPageFunction } from '../../framework/server/setup-http-server/render-page';
import { getDefault } from '../util/module-util';

export default function loadRenderPage(): RenderPageFunction {
  // expected to be bundled by webpack.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return getDefault(require('@@render-html'));
}
