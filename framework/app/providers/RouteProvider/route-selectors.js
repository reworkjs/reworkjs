import routeReducer from './route-reducer';

// selectLocationState expects a plain JS object for the routing state
export function selectLocationState() {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    // TODO double check
    const routingState = state.get(routeReducer.name); // 'route'

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
}
