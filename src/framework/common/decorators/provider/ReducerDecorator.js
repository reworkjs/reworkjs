import constantCase from 'constant-case';
import { methodDecorator, MethodDecoratorArgument } from '../decorator';
import { getPropertyMetadata, setPropertyType } from './_util';

export const TYPE_REDUCER = Symbol('TYPE_REDUCER');
const EMPTY_OBJ = {};
Object.freeze(EMPTY_OBJ);

const USAGE = '@reducer([actionType])';

export default methodDecorator((arg: MethodDecoratorArgument) => {

  parseOptions(arg);

  if (!setPropertyType(arg.descriptor.value, TYPE_REDUCER)) {
    throw new TypeError(`${USAGE}: Cannot be used on a method that has already been marked as either a @saga or an @action.`);
  }

  return transform(arg);
});

export function parseOptions(arg: MethodDecoratorArgument) {
  const options = arg.options;

  if (options.length > 1) {
    throw new TypeError(`${USAGE} only accepts one argument. ${options.length} provided`);
  }

  if (options[0] == null) {
    return EMPTY_OBJ;
  }

  const objArg = typeof options[0] === 'object' ? options[0] : { actionType: options[0] };

  if (objArg.actionType != null && typeof objArg.actionType !== 'string' && typeof objArg.actionType !== 'function') {
    throw new TypeError(`${USAGE}: Invalid option actionType: expected string, a reducer/saga method, or undefined.`);
  }

  arg.options = objArg;

  return objArg;
}

export function transform(arg: MethodDecoratorArgument) {
  const { descriptor, options, target: ProviderClass } = arg;
  const property = descriptor.value;

  const metadata = getPropertyMetadata(property);
  metadata.listenedActionTypes = metadata.listenedActionTypes || new Set();

  if (options.actionType) {
    if (typeof options.actionType === 'function') {
      const actionHandler = options.actionType;
      if (!actionHandler.actionType) {
        throw new TypeError(`Method ${actionHandler.name} does not have an action type. Is it correctly decorated ?`);
      }

      metadata.listenedActionTypes.add(actionHandler.actionType);
    } else {
      metadata.listenedActionTypes.add(options.actionType);
    }
  } else {
    metadata.actionType = `@@provider/${constantCase(ProviderClass.name)}/action/${constantCase(property.name)}`;
    metadata.listenedActionTypes.add(metadata.actionType);
  }

  return descriptor;
}
