import { default as arrayLikeKeys } from "./dist/84.js";
import { default as isObject } from "./isObject.js";
import { default as isPrototype } from "./dist/133.js";
import { default as isArrayLike } from "./isArrayLike.js";

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}






/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }

  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}






/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */

function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}


export { keysIn as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvODQuanMBwsCVwq0uL2lzT2JqZWN0LmpzBcLAlcKtLi9kaXN0LzEzMy5qcwnCwJXCsC4vaXNBcnJheUxpa2UuanMNwsCBp2RlZmF1bHSUoWyma2V5c0luJMCRkyTAwImtYXJyYXlMaWtlS2V5c5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCoaXNPYmplY3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQq2lzUHJvdG90eXBlm6FpkMIKwJILDMACwKdkZWZhdWx0kKtpc0FycmF5TGlrZZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCsbmF0aXZlS2V5c0lum6FskMIRwJISE5LZW2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19uYXRpdmVLZXlzSW4uanOnZGVmYXVsdMDAwJCrb2JqZWN0UHJvdG+boWyRpk9iamVjdMIVGJIWF8DAwMCQrmhhc093blByb3BlcnR5m6FskatvYmplY3RQcm90b8IaHZIbHMDAwMCRq29iamVjdFByb3RvqmJhc2VLZXlzSW6boWyUqGlzT2JqZWN0rG5hdGl2ZUtleXNJbqtpc1Byb3RvdHlwZa5oYXNPd25Qcm9wZXJ0ecIewJIfIJLZWWh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlS2V5c0luLmpzp2RlZmF1bHTAwMCQpmtleXNJbpuhbJOraXNBcnJheUxpa2WtYXJyYXlMaWtlS2V5c6piYXNlS2V5c0luwiHAkiIjwMDAwJDcACWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClgsNwCDCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYSCMATwsKWARgKDcLClgkAC8DCwpYLC8DAwsKWHwvAHMLClgEbDhHCwpYJAA/AwsKWCwvAwMLClhQLwATCwpbNASbMkhIUwsKWCQzAwMLClhcMwAzCwpY0ARUZwsKWBAAWwMLClgALwBjCwpYAC8DAwsKWAxDAwMLCljMBGh7CwpYEABvAwsKWAA7AHcLClmkOwMDCwpYDDxfAwsKWzNZNHyHCwpYJCsAIwsKWEQrAwMLCls0CAgsiJMLClgkGwBDCwpYJBsDAwsKWAw4jwMLC
====catalogjs annotation end====*/