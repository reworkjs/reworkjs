export default function isPojo(val: any): val is Object {
  if (val == null) {
    return false;
  }

  const proto = Object.getPrototypeOf(val);

  return proto === Object.prototype || proto === null;
}
