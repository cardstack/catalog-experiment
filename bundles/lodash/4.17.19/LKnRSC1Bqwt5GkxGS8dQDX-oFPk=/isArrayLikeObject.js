import { default as isArrayLike } from "./isArrayLike.js";
import { default as isObjectLike } from "./isObjectLike.js";



/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}


export { isArrayLikeObject as default };
/*====catalogjs annotation start====
lZKVwrAuL2lzQXJyYXlMaWtlLmpzAcLAlcKxLi9pc09iamVjdExpa2UuanMFwsCBp2RlZmF1bHSUoWyxaXNBcnJheUxpa2VPYmplY3QMwJGTDMDAg6tpc0FycmF5TGlrZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJIHCMABwKdkZWZhdWx0kLFpc0FycmF5TGlrZU9iamVjdJuhbJKsaXNPYmplY3RMaWtlq2lzQXJyYXlMaWtlwgnAkgoLwMDAwJCdlgAAAcDCw5YAGwIFwsKWCQADwMLClgsLwMDCwpYLC8DAwsKWARwGCcLClgkAB8DCwpYLDMDAwsKWEwzABMLCls0CEQoKDMLClgkRwAjCwpYJEcDAwsKWAw4LwMLC
====catalogjs annotation end====*/