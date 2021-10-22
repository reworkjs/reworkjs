import mainComponent from 'val-loader!./_get-main-component';
import { isReactComponent } from '../../util/react-util.js';

if (process.env.NODE_ENV === 'development') {
  if (!isReactComponent(mainComponent)) {
    throw new TypeError(`React main component ("entry-react") is not a react component.`);
  }
}

export default mainComponent;
