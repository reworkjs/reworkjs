export const isActionGenerator = Symbol('is-action');

export default function action(target, ignored, descriptor) {
  if (!target) {
    return action;
  }

  const value = descriptor.value;

  value[isActionGenerator] = true;

  return descriptor;
}
