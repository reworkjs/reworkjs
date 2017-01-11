
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

function suicide() {
  throw new TypeError('This method does not generate any actions. It cannot be called.');
}

export function killMethod(providerClass, propertyName) {
  replaceMethod(providerClass, propertyName, suicide);
}

export function replaceMethod(clazz, propertyName, replacement) {
  if (!canRedefineValue(clazz, propertyName)) {
    throw new TypeError(`Could not redefine property ${clazz.name}.${propertyName} because it is both non-writable and non-configurable.`);
  }

  Object.defineProperty(clazz, propertyName, { value: clazz });
  attemptChangeName(replacement, propertyName);
}
