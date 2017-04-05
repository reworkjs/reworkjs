export default function isPojo(val) {
  if (val == null) {
    return false;
  }

  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
}
