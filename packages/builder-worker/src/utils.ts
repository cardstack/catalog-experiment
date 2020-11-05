export function setMapping(
  outerKey: unknown,
  innerKey: unknown,
  innerValue: unknown,
  map: Map<unknown, Map<unknown, unknown>>
) {
  let mapping = map.get(outerKey);
  if (!mapping) {
    mapping = new Map();
    map.set(outerKey, mapping);
  }
  mapping.set(innerKey, innerValue);
}
