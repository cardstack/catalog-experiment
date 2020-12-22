//@ts-ignore
import { intersect } from "semver-intersect";

export function setDoubleNestedMapping(
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
export function setTripleNestedMapping(
  outerMostKey: unknown,
  innerKey: unknown,
  innerMostKey: unknown,
  innerMostValue: unknown,
  map: Map<unknown, Map<unknown, Map<unknown, unknown>>>
) {
  let outerMapping = map.get(outerMostKey);
  if (!outerMapping) {
    outerMapping = new Map();
    map.set(outerMostKey, outerMapping);
  }
  let innerMapping = outerMapping.get(innerKey);
  if (!innerMapping) {
    innerMapping = new Map();
    outerMapping.set(innerKey, innerMapping);
  }
  innerMapping.set(innerMostKey, innerMostValue);
}

export function stringifyReplacer(_: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: value.entries(),
    };
  } else if (value instanceof Set) {
    return {
      dataType: "Set",
      value: value.entries(),
    };
  } else {
    return value;
  }
}

export function rangeIntersection(...ranges: string[]): string {
  // semver-intersect doesn't handle '*'. A wildcard intersects with everything,
  // so just filter it out.
  let cleansedRanges = ranges.filter((r) => r !== "*");
  if (cleansedRanges.length === 0) {
    return "*";
  }
  return intersect(...cleansedRanges);
}
