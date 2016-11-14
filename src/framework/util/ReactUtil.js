export function isReactComponent(component) {

  if (component == null || typeof component === 'object') {
    return false;
  }

  return true;
}
