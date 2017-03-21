import { methodDecorator, MethodDecoratorArgument } from '../decorator';
import { setPropertyType } from './_util';

export const TYPE_ACTION_GENERATOR = Symbol('TYPE_ACTION_GENERATOR');

const USAGE = '@action';

export default methodDecorator((arg: MethodDecoratorArgument) => {
  const { descriptor, options, target } = arg;
  const boundProperty = descriptor.value.bind(target);

  if (options.length > 0) {
    throw new TypeError(`${USAGE} does not accept any arguments.`);
  }

  if (!setPropertyType(boundProperty, TYPE_ACTION_GENERATOR)) {
    throw new TypeError(`${USAGE}: Cannot be used on a method that has already been marked as either a @saga or a @reducer.`);
  }

  descriptor.value = boundProperty;

  return descriptor;
});
