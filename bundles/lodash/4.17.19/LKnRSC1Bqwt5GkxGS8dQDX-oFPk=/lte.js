import { default as createRelationalOperation } from "./dist/25.js";


/**
 * Checks if `value` is less than or equal to `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than or equal to
 *  `other`, else `false`.
 * @see _.gte
 * @example
 *
 * _.lte(1, 3);
 * // => true
 *
 * _.lte(3, 3);
 * // => true
 *
 * _.lte(3, 1);
 * // => false
 */

var lte = createRelationalOperation(function (value, other) {
  return value <= other;
});
const _default = (lte);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjUuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoO5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCjbHRlm6FskbljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uwgYJkgcIwMDAwJG5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbqhfZGVmYXVsdJuhbJGjbHRlwgvAkgwNwMDAwJCflgAAAcDCw5YAFwIFwsKWCQADwMLClgsZwMDCwpYAGcDAwsKWzQG+AQYKwsKWBAAHwMLClgADwAnCwpYEA8DAwsKWAzYEwMLClgEBCw7CwpYGAQzAwsKWAAjACMLClgkIwMDCwpYBDg3AwsI=
====catalogjs annotation end====*/