import constantCase from 'constant-case';
import { methodDecorator, MethodDecoratorArgument } from '../decorator';
import { setPropertyType, getPropertyMetadata } from './_util';

export const TYPE_SAGA = Symbol('TYPE_SAGA');

const USAGE = '@saga([actionType])';

export default methodDecorator((arg: MethodDecoratorArgument) => {

  validate(arg);

  if (!setPropertyType(arg.descriptor.value, TYPE_SAGA)) {
    throw new TypeError(`${USAGE}: Cannot be used on a method that has already been marked as either a @reducer or an @action.`);
  }

  return transform(arg);
});

// == <shared with reducer> ==

export function validate(arg: MethodDecoratorArgument) {
  const options = arg.options;

  if (options.length > 1) {
    throw new TypeError(`${USAGE} only accepts one argument. ${options.length} provided`);
  }

  if (options[0] !== void 0 && typeof options[0] !== 'string' && typeof options[0] !== 'function') {
    throw new TypeError(`${USAGE}: Invalid option name: expected string, a reducer/saga method, or undefined.`);
  }
}

export function transform(arg: MethodDecoratorArgument) {
  const { descriptor, options, target: ProviderClass } = arg;
  const property = descriptor.value;

  const metadata = getPropertyMetadata(property);
  metadata.listenedActionTypes = metadata.listenedActionTypes || new Set();

  if (options[0]) {
    if (typeof options[0] === 'function') {
      if (!options[0].actionType) {
        throw new TypeError(`Method ${options[0].name} does not have an action type. Is it correctly decorated ?`);
      }

      metadata.listenedActionTypes.add(options[0].actionType);
    } else {
      metadata.listenedActionTypes.add(options[0]);
    }
  } else {
    metadata.actionType = `@@provider/${constantCase(ProviderClass.name)}/action/${constantCase(property.name)}`;
    metadata.listenedActionTypes.add(metadata.actionType);
  }

  return descriptor;
}

// == <\shared with reducer> ==
