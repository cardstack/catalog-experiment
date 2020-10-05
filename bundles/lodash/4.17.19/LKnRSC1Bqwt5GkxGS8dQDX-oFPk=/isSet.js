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
lZSTwqwuL2Rpc3QvNDUuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqmZ2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VVbmFyeZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCobm9kZVV0aWyboWmQwg7Akw8QEcADwKdkZWZhdWx0kKZzZXRUYWeboWyQwhPAkhQVwMDAwJCqYmFzZUlzU2V0MJuhbJOsaXNPYmplY3RMaWtlpmdldFRhZ6ZzZXRUYWfCFsCSFxjAwMDAkKliYXNlSXNTZXSboWyRqmJhc2VJc1NldDDCGsCSGxzAwMDAkKlub2RlSXNTZXSboWyRqG5vZGVVdGlswh4ikx8gIcDAwMCRqG5vZGVVdGlspWlzU2V0m6Fsk6lub2RlSXNTZXSpYmFzZVVuYXJ5qWJhc2VJc1NldMIkJ5IlJsDAwMCTqWJhc2VVbmFyealiYXNlSXNTZXSpbm9kZUlzU2V0qF9kZWZhdWx0m6FskaVpc1NldMIpwJIqK8DAwMCQ3AAtlgAAAcDCw5YAFwIFwsKWCQADwMLClgsGwMDCwpYLBsAVwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgMJwCHCwpYBFw4SwsKWCQAPwMLClgsIwMDCwpYACMARwsKWBAjAwMLCljEBExbCwpYEERTAwsKWAAbAwMLClgsGwMDCwpbM0AMXGcLClgkKwAjCwpYECsDAwsKWAgEaHcLClgYBG8DCwpYACcAYwsKWBAnAwMLClicBHiPCwpYEAB/AwsKWAAnAIsLClgAJwAzCwpYBCcAcwsKWAwYQwMLCls0BTAEkKMLClgQAJcDCwpYABcAnwsKWBAXAwMLClgMAIMDCwpYBASkswsKWBgEqwMLClgAIwCbCwpYJCMDAwsKWAQ4rwMLC
====catalogjs annotation end====*/