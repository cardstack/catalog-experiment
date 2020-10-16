import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";






/**
 * This method is like `_.union` except that it accepts `comparator` which
 * is invoked to compare elements of `arrays`. Result values are chosen from
 * the first array in which the value occurs. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.unionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */

var unionWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});

export { unionWith as default };
/*====catalogjs annotation start====
lZWVwqwuL2Rpc3QvODUuanMBwsCVwqwuL2Rpc3QvNDkuanMFwsCVwqwuL2Rpc3QvNjMuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDcLAlcKpLi9sYXN0LmpzEcLAgadkZWZhdWx0lKFsqXVuaW9uV2l0aBrAkZMawMCGq2Jhc2VGbGF0dGVum6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoYmFzZVVuaXGboWmQwgrAkgsMwALAp2RlZmF1bHSQsWlzQXJyYXlMaWtlT2JqZWN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kKRsYXN0m6FpkMISwJITFMAEwKdkZWZhdWx0kKl1bmlvbldpdGiboWyVqGJhc2VSZXN0pGxhc3SoYmFzZVVuaXGrYmFzZUZsYXR0ZW6xaXNBcnJheUxpa2VPYmplY3TCFhmSFxjAwMDAlatiYXNlRmxhdHRlbqhiYXNlUmVzdKhiYXNlVW5pcbFpc0FycmF5TGlrZU9iamVjdKRsYXN03AAblgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYBC8AQwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjAFMLClgEXCg3CwpYJAAvAwsKWCwjAwMLCllwIwATCwpYBIQ4RwsKWCQAPwMLClgsRwMDCwpYMEcDAwsKWARQSFcLClgkAE8DCwpYLBMDAwsKWKATADMLCls0DCwEWGsLClgQAF8DCwpYACcAZwsKWCQnAwMLClgMjCMDCwpYCDhjAwsI=
====catalogjs annotation end====*/