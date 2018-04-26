import { getDefault } from '../../shared/util/ModuleUtil';
import { isReactComponent } from '../util/ReactUtil';

// WEBPACK
const component = getDefault(require('@@main-component'));

if (process.env.NODE_ENV === 'development') {
  if (!isReactComponent(component)) {
    const frameworkConfig = require('../../shared/framework-config');
    throw new TypeError(`React entry point (${frameworkConfig['entry-react']}) is not a react component.`);
  }
}

export default component;
