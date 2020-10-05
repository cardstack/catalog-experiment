import { default as assignValue } from "./dist/55.js";
import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isPrototype } from "./dist/133.js";
import { default as keys } from "./keys.js";







/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */

var assign = createAssigner(function (object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }

  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});
const _default = (assign);
export { _default as default };
/*====catalogjs annotation start====
lZaTwqwuL2Rpc3QvNTUuanMBk8KsLi9kaXN0LzU0LmpzBZPCrC4vZGlzdC80OC5qcwmTwrAuL2lzQXJyYXlMaWtlLmpzDZPCrS4vZGlzdC8xMzMuanMRk8KpLi9rZXlzLmpzFYGnZGVmYXVsdJShbKhfZGVmYXVsdCzAkZMswMKKq2Fzc2lnblZhbHVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKpjb3B5T2JqZWN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kK5jcmVhdGVBc3NpZ25lcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCraXNBcnJheUxpa2WboWmQwg7Akg8QwAPAp2RlZmF1bHSQq2lzUHJvdG90eXBlm6FpkMISwJITFMAEwKdkZWZhdWx0kKRrZXlzm6FpkMIWwJIXGMAFwKdkZWZhdWx0kKtvYmplY3RQcm90b5uhbJGmT2JqZWN0whodkhscwMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3Rvwh8ikiAhwMDAwJGrb2JqZWN0UHJvdG+mYXNzaWdum6Fsl65jcmVhdGVBc3NpZ25lcqtpc1Byb3RvdHlwZatpc0FycmF5TGlrZapjb3B5T2JqZWN0pGtleXOuaGFzT3duUHJvcGVydHmrYXNzaWduVmFsdWXCJCeSJSbAwMDAl6thc3NpZ25WYWx1Zapjb3B5T2JqZWN0rmNyZWF0ZUFzc2lnbmVyq2lzQXJyYXlMaWtlq2lzUHJvdG90eXBlpGtleXOuaGFzT3duUHJvcGVydHmoX2RlZmF1bHSboWyRpmFzc2lnbsIpwJIqK8DAwMCQ3AAtlgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYcC8DAwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWEArAGMLClgEXCg3CwpYJAAvAwsKWCw7AwMLClgAOwBTCwpYBGw4RwsKWCQAPwMLClgsLwMDCwpYMC8AIwsKWARgSFcLClgkAE8DCwpYLC8DAwsKWIwvAEMLClgEUFhnCwpYJABfAwsKWCwTAwMLClgkEwCHCwpY1ARoewsKWBAAbwMLClgALwB3CwpYAC8DAwsKWAxDAwMLCljMBHyPCwpYEACDAwsKWAA7AIsLClkgOwATCwpYDDxzAwsKWzQMjASQowsKWBAAlwMLClgAGwCfCwpYEBsDAwsKWAygMwMLClgEBKSzCwpYGASrAwsKWAAjAJsLClgkIwMDCwpYBDivAwsI=
====catalogjs annotation end====*/