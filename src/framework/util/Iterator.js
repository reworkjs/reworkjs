export default function *Iterator(arg) {
  if (typeof arg !== 'object' || arg == null) {
    throw new TypeError('Cannot iterate over a non-object variable');
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    const iterator = arg[Symbol.iterator];

    if (iterator) {
      yield* iterator;
      return;
    }
  }

  if (Array.isArray(arg)) {
    yield* ArrayIterator(arg);
    return;
  }

  yield* ObjectIterator(arg);
}

export function *ArrayIterator(arg) {
  const length = arg.length;

  for (let i = 0; i < length; i++) {
    yield arg[i];
  }
}

export function *ObjectIterator(arg) {
  const keys = Object.keys(arg);
  const length = keys.length;

  for (let i = 0; i < length; i++) {
    const key = keys[i];
    const value = arg[key];

    yield { key, value };
  }
}
