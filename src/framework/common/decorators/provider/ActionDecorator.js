import { methodDecorator, MethodDecoratorArgument } from '../decorator';
import { setPropertyType } from './_util';

export const TYPE_ACTION_GENERATOR = Symbol('TYPE_ACTION_GENERATOR');

const USAGE = '@saga';

export default methodDecorator((arg: MethodDecoratorArgument) => {
  const { descriptor, options } = arg;
  const property = descriptor.value;

  if (options.length > 0) {
    throw new TypeError(`${USAGE} does not accept any arguments.`);
  }

  if (!setPropertyType(property, TYPE_ACTION_GENERATOR)) {
    throw new TypeError(`${USAGE}: Cannot be used on a method that has already been marked as either a @saga or a @reducer.`);
  }

  return descriptor;
});
