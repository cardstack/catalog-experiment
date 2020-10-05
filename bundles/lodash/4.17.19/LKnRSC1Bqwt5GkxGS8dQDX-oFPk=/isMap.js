import { default as getTag } from "./dist/45.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";



/** `Object#toString` result references. */

var mapTag = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap0(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

const baseIsMap = (baseIsMap0);




/* Node.js helper references. */

var nodeIsMap = nodeUtil && nodeUtil.isMap;
/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */

var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
const _default = (isMap);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNDUuanMBk8KxLi9pc09iamVjdExpa2UuanMFk8KtLi9kaXN0LzEzNS5qcwmTwqwuL2Rpc3QvOTQuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0LMCRkyzAwoqmZ2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxpc09iamVjdExpa2WboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VVbmFyeZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCobm9kZVV0aWyboWmQwg7Akw8QEcADwKdkZWZhdWx0kKZtYXBUYWeboWyQwhPAkhQVwMDAwJCqYmFzZUlzTWFwMJuhbJOsaXNPYmplY3RMaWtlpmdldFRhZ6ZtYXBUYWfCFsCSFxjAwMDAkKliYXNlSXNNYXCboWyRqmJhc2VJc01hcDDCGsCSGxzAwMDAkKlub2RlSXNNYXCboWyRqG5vZGVVdGlswh4ikx8gIcDAwMCRqG5vZGVVdGlspWlzTWFwm6Fsk6lub2RlSXNNYXCpYmFzZVVuYXJ5qWJhc2VJc01hcMIkJ5IlJsDAwMCTqWJhc2VVbmFyealiYXNlSXNNYXCpbm9kZUlzTWFwqF9kZWZhdWx0m6FskaVpc01hcMIpwJIqK8DAwMCQ3AAtlgAAAcDCw5YAFwIFwsKWCQADwMLClgsGwMDCwpYLBsAVwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgMJwCHCwpYBFw4SwsKWCQAPwMLClgsIwMDCwpYACMARwsKWBAjAwMLCljEBExbCwpYEERTAwsKWAAbAwMLClgsGwMDCwpbM0AMXGcLClgkKwAjCwpYECsDAwsKWAgEaHcLClgYBG8DCwpYACcAYwsKWBAnAwMLClicBHiPCwpYEAB/AwsKWAAnAIsLClgAJwAzCwpYBCcAcwsKWAwYQwMLCls0BTAEkKMLClgQAJcDCwpYABcAnwsKWBAXAwMLClgMAIMDCwpYBASkswsKWBgEqwMLClgAIwCbCwpYJCMDAwsKWAQ4rwMLC
====catalogjs annotation end====*/