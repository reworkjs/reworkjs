export default function forEach<T>(item: T | T[], callback: (val: T) => any) {
  if (Array.isArray(item)) {
    item.forEach(callback);
  } else {
    callback(item);
  }
}
