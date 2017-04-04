export default function pushAll(array, items) {
  if (Array.isArray(items)) {
    array.push(...items);
  } else {
    array.push(items);
  }
}
