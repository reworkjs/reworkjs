export default function pushAll<T>(array: T[], items: T | T[]): void {
  if (Array.isArray(items)) {
    array.push(...items);
  } else {
    array.push(items);
  }
}
