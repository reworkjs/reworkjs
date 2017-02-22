import { takeLatest, takeEvery } from 'redux-saga/effects';
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
  const metadata = getPropertyMetadata(arg.descriptor.value);

  if (arg.options.trackStatus) {
    metadata.trackStatus = true;
  }

  if (arg.options.take) {
    const take = arg.options.take;

    let takeFunction = null;
    if (typeof take === 'string') {
      switch (take) {
        case 'latest':
          takeFunction = takeLatest;
          break;

        case 'every':
          takeFunction = takeEvery;
          break;

        default:
      }
    } else if (typeof take === 'function') {
      takeFunction = take;
    }

    if (!takeFunction) {
      throw new TypeError(`Invalid value for take (@saga({ take: ${JSON.stringify(take)} }))`);
    }

    if (!metadata.takeFunctions) {
      metadata.takeFunctions = {};
    }

    metadata.takeFunctions[metadata.listenedActionTypes.size] = takeFunction;
  }

  return descriptor;
}
