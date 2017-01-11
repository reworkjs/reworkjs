import { methodDecorator, MethodDecoratorArgument } from '../decorator';
import { setPropertyType } from './_util';
import { validate, transform } from './SagaDecorator';

export const TYPE_REDUCER = Symbol('TYPE_REDUCER');

const USAGE = '@reducer([actionType])';

export default methodDecorator((arg: MethodDecoratorArgument) => {

  validate(arg);

  if (!setPropertyType(arg.descriptor.value, TYPE_REDUCER)) {
    throw new TypeError(`${USAGE}: Cannot be used on a method that has already been marked as either a @saga or an @action.`);
  }

  return transform(arg);
});
