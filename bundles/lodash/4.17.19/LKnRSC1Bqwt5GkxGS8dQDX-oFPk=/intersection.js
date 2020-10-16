import { default as arrayMap } from "./dist/98.js";
import { default as baseIntersection } from "./dist/62.js";
import { default as baseRest } from "./dist/49.js";
import { default as castArrayLikeObject } from "./dist/82.js";





/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */

var intersection = baseRest(function (arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
});

export { intersection as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvOTguanMBwsCVwqwuL2Rpc3QvNjIuanMFwsCVwqwuL2Rpc3QvNDkuanMJwsCVwqwuL2Rpc3QvODIuanMNwsCBp2RlZmF1bHSUoWysaW50ZXJzZWN0aW9uFsCRkxbAwIWoYXJyYXlNYXCboWmQwgLAkgMEwADAp2RlZmF1bHSQsGJhc2VJbnRlcnNlY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIKwJILDMACwKdkZWZhdWx0kLNjYXN0QXJyYXlMaWtlT2JqZWN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kKxpbnRlcnNlY3Rpb26boWyUqGJhc2VSZXN0qGFycmF5TWFws2Nhc3RBcnJheUxpa2VPYmplY3SwYmFzZUludGVyc2VjdGlvbsISFZITFMDAwMCUqGFycmF5TWFwsGJhc2VJbnRlcnNlY3Rpb26oYmFzZVJlc3SzY2FzdEFycmF5TGlrZU9iamVjdNwAF5YAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWJAjAEMLClgEXBgnCwpYJAAfAwsKWCxDAwMLCljcQwMDCwpYBFwoNwsKWCQALwMLClgsIwMDCwpYACMAEwsKWARcOEcLClgkAD8DCwpYLE8DAwsKWCRPACMLCls0CFwESFsLClgQAE8DCwpYADMAVwsKWCQzAwMLClgMRDMDCwpYCDhTAwsI=
====catalogjs annotation end====*/