import { default as constant } from "./constant.js";
import { default as createInverter } from "./dist/76.js";
import { default as identity } from "./identity.js";




/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/**
 * Creates an object composed of the inverted keys and values of `object`.
 * If `object` contains duplicate values, subsequent values overwrite
 * property assignments of previous values.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Object
 * @param {Object} object The object to invert.
 * @returns {Object} Returns the new inverted object.
 * @example
 *
 * var object = { 'a': 1, 'b': 2, 'c': 1 };
 *
 * _.invert(object);
 * // => { '1': 'c', '2': 'b' }
 */

var invert = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  result[value] = key;
}, constant(identity));

export { invert as default };
/*====catalogjs annotation start====
lZOVwq0uL2NvbnN0YW50LmpzAcLAlcKsLi9kaXN0Lzc2LmpzBcLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKZpbnZlcnQcwJGTHMDAhqhjb25zdGFudJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCuY3JlYXRlSW52ZXJ0ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqGlkZW50aXR5m6FpkMIKwJILDMACwKdkZWZhdWx0kKtvYmplY3RQcm90b5uhbJGmT2JqZWN0wg4Rkg8QwMDAwJC0bmF0aXZlT2JqZWN0VG9TdHJpbmeboWyRq29iamVjdFByb3RvwhMWkhQVwMDAwJGrb2JqZWN0UHJvdG+maW52ZXJ0m6FslK5jcmVhdGVJbnZlcnRlcrRuYXRpdmVPYmplY3RUb1N0cmluZ6hjb25zdGFudKhpZGVudGl0ecIYG5IZGsDAwMCUqGNvbnN0YW50rmNyZWF0ZUludmVydGVyqGlkZW50aXR5tG5hdGl2ZU9iamVjdFRvU3RyaW5n3AAdlgAAAcDCw5YAGAIFwsKWCQADwMLClgsIwMDCwpYtCMAMwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWAA7AFcLClgEYCg3CwpYJAAvAwsKWCwjAwMLClgEIwMDCwpYyAQ4SwsKWBAAPwMLClgALwBHCwpYAC8DAwsKWAxDAwMLClsyNARMXwsKWBAAUwMLClgAUwBbCwpZrFMAEwsKWAwkQwMLCls0B4QEYHMLClgQAGcDCwpYABsAbwsKWCQbAwMLClgMCCMDCwpYCDhrAwsI=
====catalogjs annotation end====*/