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
const _default = (invert);
export { _default as default };
/*====catalogjs annotation start====
lZOTwq0uL2NvbnN0YW50LmpzAZPCrC4vZGlzdC83Ni5qcwWTwq0uL2lkZW50aXR5LmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdCDAkZMgwMKHqGNvbnN0YW50m6FpkMICwJIDBMAAwKdkZWZhdWx0kK5jcmVhdGVJbnZlcnRlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoaWRlbnRpdHmboWmQwgrAkgsMwALAp2RlZmF1bHSQq29iamVjdFByb3Rvm6FskaZPYmplY3TCDhGSDxDAwMDAkLRuYXRpdmVPYmplY3RUb1N0cmluZ5uhbJGrb2JqZWN0UHJvdG/CExaSFBXAwMDAkatvYmplY3RQcm90b6ZpbnZlcnSboWyUrmNyZWF0ZUludmVydGVytG5hdGl2ZU9iamVjdFRvU3RyaW5nqGNvbnN0YW50qGlkZW50aXR5whgbkhkawMDAwJSoY29uc3RhbnSuY3JlYXRlSW52ZXJ0ZXKoaWRlbnRpdHm0bmF0aXZlT2JqZWN0VG9TdHJpbmeoX2RlZmF1bHSboWyRpmludmVydMIdwJIeH8DAwMCQ3AAhlgAAAcDCw5YAGAIFwsKWCQADwMLClgsIwMDCwpYtCMAMwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWAA7AFcLClgEYCg3CwpYJAAvAwsKWCwjAwMLClgEIwMDCwpYyAQ4SwsKWBAAPwMLClgALwBHCwpYAC8DAwsKWAxDAwMLClsyNARMXwsKWBAAUwMLClgAUwBbCwpZrFMAEwsKWAwkQwMLCls0B4QEYHMLClgQAGcDCwpYABsAbwsKWBAbAwMLClgMCCMDCwpYBAR0gwsKWBgEewMLClgAIwBrCwpYJCMDAwsKWAQ4fwMLC
====catalogjs annotation end====*/