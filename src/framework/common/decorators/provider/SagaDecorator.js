export const isSaga = Symbol('is-saga');

export default function saga(target, ignored, descriptor) {
  if (!target) {
    return saga;
  }

  const value = descriptor.value;

  value[isSaga] = true;

  return descriptor;
}
