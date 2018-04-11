// @flow

import { type RenderPageFunction } from '../../framework/server/setup-http-server/render-page';
import { getDefault } from '../util/ModuleUtil';

export default function loadRenderPage(): ?RenderPageFunction {
  // $FlowIgnore
  return getDefault(require('@@render-html'));
}
