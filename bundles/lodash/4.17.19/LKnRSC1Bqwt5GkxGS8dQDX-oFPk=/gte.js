import { default as createRelationalOperation } from "./dist/25.js";


/**
 * Checks if `value` is greater than or equal to `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than or equal to
 *  `other`, else `false`.
 * @see _.lte
 * @example
 *
 * _.gte(3, 1);
 * // => true
 *
 * _.gte(3, 3);
 * // => true
 *
 * _.gte(1, 3);
 * // => false
 */

var gte = createRelationalOperation(function (value, other) {
  return value >= other;
});

export { gte as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjUuanMBwsCBp2RlZmF1bHSUoWyjZ3RlCsCRkwrAwIK5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCjZ3Rlm6FskbljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uwgYJkgcIwMDAwJG5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbpuWAAABwMLDlgAXAgXCwpYJAAPAwsKWCxnAwMLClgAZwMDCwpbNAcQBBgrCwpYEAAfAwsKWAAPACcLClgkDwMDCwpYDNgTAwsKWAg4IwMLC
====catalogjs annotation end====*/