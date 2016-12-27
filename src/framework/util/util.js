
export function attemptChangeName(obj, name) {
  if (!canRedefineValue(obj, 'name')) {
    return;
  }

  Object.defineProperty(obj, 'name', {
    value: name,
  });
}

export function canRedefineValue(obj, property) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, property);
  return descriptor.configurable || descriptor.writable;
}
