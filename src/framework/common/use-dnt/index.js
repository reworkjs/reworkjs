// @flow

export function useDnt(): string {
  return window.navigator.doNotTrack || window.doNotTrack || window.navigator.msDoNotTrack;
}
