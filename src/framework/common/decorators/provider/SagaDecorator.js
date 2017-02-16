import { methodDecorator, MethodDecoratorArgument } from '../decorator';
import { setPropertyType, getPropertyMetadata } from './_util';
import { transform as reducerTransform, parseOptions as reducerParseOpts } from './ReducerDecorator';

export const TYPE_SAGA = Symbol('TYPE_SAGA');

const USAGE = '@saga([actionType || { actionType, trackStatus }])';

export default methodDecorator((arg: MethodDecoratorArgument) => {

  parseOptions(arg);

  if (!setPropertyType(arg.descriptor.value, TYPE_SAGA)) {
    throw new TypeError(`${USAGE}: Cannot be used on a method that has already been marked as either a @reducer or an @action.`);
  }

  return transform(arg);
});

function parseOptions(arg: MethodDecoratorArgument) {
  const options = reducerParseOpts(arg);

  if (options.trackStatus != null && typeof options.trackStatus !== 'boolean') {
    throw new TypeError(`${USAGE}: Invalid option trackStatus: expected boolean.`);
  }
}

export function transform(arg: MethodDecoratorArgument) {
  const descriptor = reducerTransform(arg);

  if (arg.options.trackStatus) {
    const metadata = getPropertyMetadata(arg.descriptor.value);
    metadata.trackStatus = true;
  }

  return descriptor;
}
