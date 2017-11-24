// @flow

const listeners: Map<string, Set<Function>> = new Map();

export function hookServer(eventName: string, cb: Function) {
  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set());
  }

  const listenerset = listeners.get(eventName);
  if (!listenerset) {
    return;
  }

  listenerset.add(cb);
}

export function unhookServer(eventName: string, cb: Function) {
  const set = listeners.get(eventName);
  if (set == null) {
    return;
  }

  set.delete(cb);

  if (set.size === 0) {
    listeners.delete(eventName);
  }
}

export function dispatchHook(eventName: string, ...data: any) {
  const listenerSet = listeners.get(eventName);
  if (!listenerSet) {
    return;
  }

  for (const listener of listenerSet.values()) {
    listener(...data);
  }
}
