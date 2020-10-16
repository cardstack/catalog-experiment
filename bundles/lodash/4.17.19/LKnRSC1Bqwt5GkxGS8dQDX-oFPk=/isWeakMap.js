import { default as getTag } from "./dist/45.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var weakMapTag = '[object WeakMap]';
/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */

function isWeakMap(value) {
  return isObjectLike(value) && getTag(value) == weakMapTag;
}


export { isWeakMap as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDUuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwIGnZGVmYXVsdJShbKlpc1dlYWtNYXAQwJGTEMDAhKZnZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCqd2Vha01hcFRhZ5uhbJDCCsCSCwzAwMDAkKlpc1dlYWtNYXCboWyTrGlzT2JqZWN0TGlrZaZnZXRUYWeqd2Vha01hcFRhZ8INwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsGwMDCwpYLBsAMwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLCljEBCg3CwpYEFQvAwsKWAArAwMLClgsKwMDCwpbNAV0DDhDCwpYJCcAIwsKWCQnAwMLClgMOD8DCwg==
====catalogjs annotation end====*/