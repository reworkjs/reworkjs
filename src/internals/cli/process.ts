import type { ChildProcess, Serializable } from 'child_process';

type Listener = (data: Serializable) => any;

const listenerMap = new WeakMap<ChildProcess, Map<string, Listener[]>>();

export function listenMsg(proc: ChildProcess, msgType: string, callback: Listener) {
  if (!listenerMap.has(proc)) {
    bindMessageHandler(proc);
  }

  return addMessageListener(proc, msgType, callback);
}

function bindMessageHandler(proc: ChildProcess): void {
  proc.on('message', data => {
    if (!listenerMap.has(proc)) {
      return;
    }

    if (data == null || typeof data !== 'object'
      // @ts-expect-error
      || typeof data.cmd !== 'string') {
      return;
    }

    // @ts-expect-error
    const msgType: string = data.cmd;

    const listeners = listenerMap.get(proc)?.get(msgType);
    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(data);
    }
  });
}

function addMessageListener(proc: ChildProcess, msgType: string, callback: Listener): void {
  const listeners = listenerMap.get(proc) ?? new Map();
  if (!listeners.has(msgType)) {
    listeners.set(msgType, []);
  }

  listeners.get(msgType).push(callback);

  listenerMap.set(proc, listeners);
}
