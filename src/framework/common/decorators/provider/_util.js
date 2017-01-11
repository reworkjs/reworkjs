export const propertyType = Symbol('property-type');
export const propertyMetadata = Symbol('is-reducer');
export const TYPE_STATE = Symbol('TYPE_STATE');

export function getPropertyMetadata(property) {
  const reducerData = property[propertyMetadata] || {};
  property[propertyMetadata] = reducerData;

  return reducerData;
}

export function setPropertyType(property, type) {
  if (property[propertyType] && property[propertyType] !== type) {
    return false;
  }

  property[propertyType] = type;

  return true;
}
