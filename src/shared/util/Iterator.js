export default function *iterator(arg) {
  if (typeof arg !== 'object' || arg == null) {
    throw new TypeError('Cannot iterate over a non-object variable');
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    const theIterator = arg[Symbol.iterator];

    if (theIterator) {
      yield* theIterator;
      return;
    }
  }

  if (Array.isArray(arg)) {
    yield* arrayIterator(arg);
    return;
  }

  yield* objectIterator(arg);
}

export function *arrayIterator(arg) {
  const length = arg.length;

  for (let i = 0; i < length; i++) {
    yield arg[i];
  }
}

export function *objectIterator(arg) {
  const keys = Object.keys(arg);
  const length = keys.length;

  for (let i = 0; i < length; i++) {
    const key = keys[i];
    const value = arg[key];

    yield { key, value };
  }
}
