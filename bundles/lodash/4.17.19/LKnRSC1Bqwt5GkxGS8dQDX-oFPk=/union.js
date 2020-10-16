import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";





/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */

var union = baseRest(function (arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

export { union as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvODUuanMBwsCVwqwuL2Rpc3QvNDkuanMFwsCVwqwuL2Rpc3QvNjMuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDcLAgadkZWZhdWx0lKFspXVuaW9uFsCRkxbAwIWrYmFzZUZsYXR0ZW6boWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKhiYXNlVW5pcZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCxaXNBcnJheUxpa2VPYmplY3SboWmQwg7Akg8QwAPAp2RlZmF1bHSQpXVuaW9um6FslKhiYXNlUmVzdKhiYXNlVW5pcatiYXNlRmxhdHRlbrFpc0FycmF5TGlrZU9iamVjdMISFZITFMDAwMCUq2Jhc2VGbGF0dGVuqGJhc2VSZXN0qGJhc2VVbmlxsWlzQXJyYXlMaWtlT2JqZWN03AAXlgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYBC8AQwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjADMLClgEXCg3CwpYJAAvAwsKWCwjAwMLClh4IwATCwpYBIQ4RwsKWCQAPwMLClgsRwMDCwpYMEcDAwsKWzQG3ARIWwsKWBAATwMLClgAFwBXCwpYJBcDAwsKWAwwIwMLClgIOFMDCwg==
====catalogjs annotation end====*/