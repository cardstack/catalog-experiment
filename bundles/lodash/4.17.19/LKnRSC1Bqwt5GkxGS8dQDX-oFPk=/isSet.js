import { default as getTag } from "./dist/45.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var setTag = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet0(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

const baseIsSet = (baseIsSet0);




/* Node.js helper references. */

var nodeIsSet = nodeUtil && nodeUtil.isSet;
/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */

var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
const _default = (isSet);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNDUuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqmZ2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VVbmFyeZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCobm9kZVV0aWyboWmQwg7Akw8QEcADwKdkZWZhdWx0kKZzZXRUYWeboWyQwhPAkhQVwMDAwJCqYmFzZUlzU2V0MJuhbJOsaXNPYmplY3RMaWtlpmdldFRhZ6ZzZXRUYWfCFsCSFxjAwMDAkKliYXNlSXNTZXSboWyRqmJhc2VJc1NldDDCGsCSGxyS2VhodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUlzU2V0Lmpzp2RlZmF1bHTAwMCQqW5vZGVJc1NldJuhbJGobm9kZVV0aWzCHiKTHyAhwMDAwJGobm9kZVV0aWylaXNTZXSboWyTqW5vZGVJc1NldKliYXNlVW5hcnmpYmFzZUlzU2V0wiQnkiUmwMDAwJOpYmFzZVVuYXJ5qWJhc2VJc1NldKlub2RlSXNTZXSoX2RlZmF1bHSboWyRpWlzU2V0winAkiorwMDAwJDcAC2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwbAwMLClgsGwBXCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWAwnAIcLClgEXDhLCwpYJAA/AwsKWCwjAwMLClgAIwBHCwpYECMDAwsKWMQETFsLClgQRFMDCwpYABsDAwsKWCwbAwMLClszQAxcZwsKWCQrACMLClgQKwMDCwpYCARodwsKWBgEbwMLClgAJwBjCwpYECcDAwsKWJwEeI8LClgQAH8DCwpYACcAiwsKWAAnADMLClgEJwBzCwpYDBhDAwsKWzQFMASQowsKWBAAlwMLClgAFwCfCwpYEBcDAwsKWAwAgwMLClgEBKSzCwpYGASrAwsKWAAjAJsLClgkIwMDCwpYBDivAwsI=
====catalogjs annotation end====*/