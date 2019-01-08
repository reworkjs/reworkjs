// @flow

import { isReactComponent } from '../../util/ReactUtil';

import mainComponent from 'val-loader!./_get-main-component';

if (process.env.NODE_ENV === 'development') {
  if (!isReactComponent(mainComponent)) {
    throw new TypeError(`React main component ("entry-react") is not a react component.`);
  }
}

export default mainComponent;
