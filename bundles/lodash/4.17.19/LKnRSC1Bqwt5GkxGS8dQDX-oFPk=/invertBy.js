import { default as baseIteratee } from "./dist/6.js";
import { default as createInverter } from "./dist/76.js";



/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/**
 * This method is like `_.invert` except that the inverted object is generated
 * from the results of running each element of `object` thru `iteratee`. The
 * corresponding inverted value of each inverted key is an array of keys
 * responsible for generating the inverted value. The iteratee is invoked
 * with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Object
 * @param {Object} object The object to invert.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Object} Returns the new inverted object.
 * @example
 *
 * var object = { 'a': 1, 'b': 2, 'c': 1 };
 *
 * _.invertBy(object);
 * // => { '1': ['a', 'c'], '2': ['b'] }
 *
 * _.invertBy(object, function(value) {
 *   return 'group' + value;
 * });
 * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
 */

var invertBy = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  if (hasOwnProperty.call(result, value)) {
    result[value].push(key);
  } else {
    result[value] = [key];
  }
}, baseIteratee);
const _default = (invertBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqsuL2Rpc3QvNi5qcwGTwqwuL2Rpc3QvNzYuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0IsCRkyLAwoesYmFzZUl0ZXJhdGVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kK5jcmVhdGVJbnZlcnRlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCrb2JqZWN0UHJvdG+boWyRpk9iamVjdMIKDpMLDA3AwMDAkK5oYXNPd25Qcm9wZXJ0eZuhbJGrb2JqZWN0UHJvdG/CEBOSERLAwMDAkatvYmplY3RQcm90b7RuYXRpdmVPYmplY3RUb1N0cmluZ5uhbJGrb2JqZWN0UHJvdG/CFRiSFhfAwMDAkatvYmplY3RQcm90b6hpbnZlcnRCeZuhbJSuY3JlYXRlSW52ZXJ0ZXK0bmF0aXZlT2JqZWN0VG9TdHJpbmeuaGFzT3duUHJvcGVydHmsYmFzZUl0ZXJhdGVlwhodkhscwMDAwJSsYmFzZUl0ZXJhdGVlrmNyZWF0ZUludmVydGVyrmhhc093blByb3BlcnR5tG5hdGl2ZU9iamVjdFRvU3RyaW5nqF9kZWZhdWx0m6FskahpbnZlcnRCecIfwJIgIcDAwMCQ3AAjlgAAAcDCw5YAFgIFwsKWCQADwMLClgsMwMDCwpZiDMDAwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWAA7AF8LCljEBCg/CwpYEAAvAwsKWAAvADsLClgALwMDCwpYAC8DAwsKWAxDAwMLCljMBEBTCwpYEABHAwsKWAA7AE8LClhkOwATCwpYDDwzAwsKWzI0BFRnCwpYEABbAwsKWABTAGMLClmsUwBLCwpYDCQ3AwsKWzQNMARoewsKWBAAbwMLClgAIwB3CwpYECMDAwsKWAwEIwMLClgEBHyLCwpYGASDAwsKWAAjAHMLClgkIwMDCwpYBDiHAwsI=
====catalogjs annotation end====*/