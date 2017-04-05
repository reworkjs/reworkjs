export default function forEach(item, callback) {
  if (Array.isArray(item)) {
    item.forEach(callback);
  } else {
    callback(item);
  }
}
