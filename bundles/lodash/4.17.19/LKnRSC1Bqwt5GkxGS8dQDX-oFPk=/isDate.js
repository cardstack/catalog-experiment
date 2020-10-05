import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var dateTag = '[object Date]';
/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */

function baseIsDate0(value) {
  return isObjectLike(value) && baseGetTag(value) == dateTag;
}

const baseIsDate = (baseIsDate0);




/* Node.js helper references. */

var nodeIsDate = nodeUtil && nodeUtil.isDate;
/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */

var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
const _default = (isDate);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKliYXNlVW5hcnmboWmQwgrAkgsMwALAp2RlZmF1bHSQqG5vZGVVdGlsm6FpkMIOwJMPEBHAA8CnZGVmYXVsdJCnZGF0ZVRhZ5uhbJDCE8CSFBXAwMDAkKtiYXNlSXNEYXRlMJuhbJOsaXNPYmplY3RMaWtlqmJhc2VHZXRUYWenZGF0ZVRhZ8IWwJIXGMDAwMCQqmJhc2VJc0RhdGWboWyRq2Jhc2VJc0RhdGUwwhrAkhscwMDAwJCqbm9kZUlzRGF0ZZuhbJGobm9kZVV0aWzCHiKTHyAhwMDAwJGobm9kZVV0aWymaXNEYXRlm6Fsk6pub2RlSXNEYXRlqWJhc2VVbmFyeapiYXNlSXNEYXRlwiQnkiUmwMDAwJOpYmFzZVVuYXJ5qmJhc2VJc0RhdGWqbm9kZUlzRGF0ZahfZGVmYXVsdJuhbJGmaXNEYXRlwinAkiorwMDAwJDcAC2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwBXCwpYBHAYJwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWAwnAIcLClgEXDhLCwpYJAA/AwsKWCwjAwMLClgAIwBHCwpYECMDAwsKWMQETFsLClgQSFMDCwpYAB8DAwsKWCwfAwMLClszZAxcZwsKWCQvACMLClgQLwMDCwpYCARodwsKWBgEbwMLClgAKwBjCwpYECsDAwsKWJwEeI8LClgQAH8DCwpYACsAiwsKWAArADMLClgEKwBzCwpYDBxDAwsKWzQFgASQowsKWBAAlwMLClgAGwCfCwpYEBsDAwsKWAwAgwMLClgEBKSzCwpYGASrAwsKWAAjAJsLClgkIwMDCwpYBDivAwsI=
====catalogjs annotation end====*/