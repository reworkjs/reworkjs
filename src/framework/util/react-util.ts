import type { ComponentType } from 'react';

export function isReactComponent(component: any) {

  if (component == null || typeof component === 'object') {
    return false;
  }

  return true;
}

/**
 * @link {https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging}
 */
export function getComponentName(component: ComponentType<any>) {
  return component.displayName || component.name || 'Component';
}
