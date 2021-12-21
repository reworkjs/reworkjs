import type { ChildProcess, Serializable } from 'child_process';

type Listener = (data: Serializable) => any;

const listenerMap = new WeakMap<ChildProcess, Map<string, Set<Listener>>>();

export async function waitForMessage(proc: ChildProcess, messageType: string): Promise<Serializable> {
  return new Promise<Serializable>(resolve => {
    const removeListener = listenMsg(proc, messageType, data => {
      removeListener();
      resolve(data);
    });
  });
}

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

function addMessageListener(proc: ChildProcess, msgType: string, callback: Listener): (() => void) {
  const listeners = listenerMap.get(proc) ?? new Map();
  if (!listeners.has(msgType)) {
    listeners.set(msgType, new Set());
  }

  const messageListeners = listeners.get(msgType);
  messageListeners.add(callback);

  listenerMap.set(proc, listeners);

  return () => {
    messageListeners.delete(callback);
  };
}
