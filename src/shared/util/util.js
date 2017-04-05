export function attemptChangeName(obj, name) {
  if (canRedefineValue(obj, 'name')) {
    Object.defineProperty(obj, 'name', {
      value: name,
    });
  }

  if (canRedefineValue(obj, 'displayName')) {
    Object.defineProperty(obj, 'displayName', {
      value: name,
    });
  }
}

export function canRedefineValue(obj, property) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, property);
  if (!descriptor) {
    return Object.isExtensible(obj);
  }

  return descriptor.configurable || descriptor.writable;
}

function suicide() {
  throw new TypeError('This method cannot be called.');
}

Object.freeze(suicide);

export function killMethod(Class, propertyName) {
  replaceMethod(Class, propertyName, suicide);
}

export function replaceMethod(clazz, propertyName, replacement) {
  if (!canRedefineValue(clazz, propertyName)) {
    throw new TypeError(`Could not redefine property ${clazz.name}.${propertyName} because it is both non-writable and non-configurable.`);
  }

  Object.defineProperty(clazz, propertyName, { value: replacement });
  attemptChangeName(replacement, propertyName);
}
