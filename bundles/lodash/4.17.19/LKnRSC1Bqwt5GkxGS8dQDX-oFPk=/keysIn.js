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
function nativeKeysIn0(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

const nativeKeysIn = (nativeKeysIn0);




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

function baseKeysIn0(object) {
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

const baseKeysIn = (baseKeysIn0);




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

const _default = (keysIn);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvODQuanMBk8KtLi9pc09iamVjdC5qcwWTwq0uL2Rpc3QvMTMzLmpzCZPCsC4vaXNBcnJheUxpa2UuanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0MMCRkzDAwoytYXJyYXlMaWtlS2V5c5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCoaXNPYmplY3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQq2lzUHJvdG90eXBlm6FpkMIKwJILDMACwKdkZWZhdWx0kKtpc0FycmF5TGlrZZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCtbmF0aXZlS2V5c0luMJuhbJDCEcCSEhPAwMDAkKxuYXRpdmVLZXlzSW6boWyRrW5hdGl2ZUtleXNJbjDCFcCSFheS2VtodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fbmF0aXZlS2V5c0luLmpzp2RlZmF1bHTAwMCQq29iamVjdFByb3Rvm6FskaZPYmplY3TCGRySGhvAwMDAkK5oYXNPd25Qcm9wZXJ0eZuhbJGrb2JqZWN0UHJvdG/CHiGSHyDAwMDAkatvYmplY3RQcm90b6tiYXNlS2V5c0luMJuhbJSoaXNPYmplY3SsbmF0aXZlS2V5c0luq2lzUHJvdG90eXBlrmhhc093blByb3BlcnR5wiLAkiMkwMDAwJCqYmFzZUtleXNJbpuhbJGrYmFzZUtleXNJbjDCJsCSJyiS2VlodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUtleXNJbi5qc6dkZWZhdWx0wMDAkKZrZXlzSW6boWyTq2lzQXJyYXlMaWtlrWFycmF5TGlrZUtleXOqYmFzZUtleXNJbsIpwJIqK8DAwMCQqF9kZWZhdWx0m6FskaZrZXlzSW7CLcCSLi/AwMDAkNwAMZYAAAHAwsOWABcCBcLClgkAA8DCwpYLDcDAwsKWCw3AKMLClgEYBgnCwpYJAAfAwsKWCwjAwMLClhIIwBfCwpYBGAoNwsKWCQALwMLClgsLwMDCwpYfC8AgwsKWARsOEcLClgkAD8DCwpYLC8DAwsKWFAvABMLCls0BJsySEhTCwpYJDcDAwsKWBA3AwMLClgIBFRjCwpYGARbAwsKWAAzAE8LClhcMwAzCwpYyARkdwsKWBAAawMLClgALwBzCwpYAC8DAwsKWAxDAwMLCljMBHiLCwpYEAB/AwsKWAA7AIcLClmkOwMDCwpYDDxvAwsKWzNZNIyXCwpYJC8AIwsKWBAvAwMLClgIBJinCwpYGASfAwsKWAArAJMLClhEKwMDCwpbNAgALKizCwpYJBsAQwsKWBAbAwMLClgIBLTDCwpYGAS7AwsKWAAjAK8LClgkIwMDCwpYBDi/AwsI=
====catalogjs annotation end====*/