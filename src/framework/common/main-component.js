import frameworkConfig from '../../shared/framework-config';
import { getDefault } from '../../shared/util/ModuleUtil';
import { isReactComponent } from '../util/ReactUtil';

// WEBPACK
const component = getDefault(require('@@main-component')); // eslint-disable-line

if (!isReactComponent(component)) {
  throw new TypeError(`React entry point (${frameworkConfig['entry-react']}) is not a react component.`);
}

export default component;
