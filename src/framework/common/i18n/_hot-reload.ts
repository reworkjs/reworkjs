
type HotReloadListener = () => void;

const hotReloadListeners: Set<HotReloadListener> = new Set();
export function onIntlHotReload(callback: HotReloadListener) {
  hotReloadListeners.add(callback);

  return () => offIntlHotReload(callback);
}

export function offIntlHotReload(callback: HotReloadListener) {
  hotReloadListeners.delete(callback);
}

export function triggerI18nHotReload() {
  hotReloadListeners.forEach(callback => callback());
}
