const LISTENERS = Symbol('listeners');

export function listenMsg(proc: process, msgType: String, callback: Function) {
  if (!proc[LISTENERS]) {
    bindMessageHandler(proc);
  }

  return addMessageListener(proc, msgType, callback);
}

function bindMessageHandler(proc) {
  proc.on('message', data => {
    if (!proc[LISTENERS]) {
      return;
    }

    if (data == null || typeof data !== 'object' || !data.cmd) {
      return;
    }

    const msgType = data.cmd;

    const listeners = proc[LISTENERS].get(msgType);
    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(data);
    }
  });
}

function addMessageListener(proc, msgType, callback) {
  if (!proc[LISTENERS]) {
    proc[LISTENERS] = new Map();
  }

  const listenerMap = proc[LISTENERS];
  if (!listenerMap.has(msgType)) {
    listenerMap.set(msgType, []);
  }

  listenerMap.get(msgType).push(callback);
}
