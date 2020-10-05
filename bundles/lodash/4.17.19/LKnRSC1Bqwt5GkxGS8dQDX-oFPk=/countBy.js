import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";



/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the number of times the key was returned by `iteratee`. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.countBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': 1, '6': 2 }
 *
 * // The `_.property` iteratee shorthand.
 * _.countBy(['one', 'two', 'three'], 'length');
 * // => { '3': 2, '5': 1 }
 */

var countBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    ++result[key];
  } else {
    baseAssignValue(result, key, 1);
  }
});
const _default = (countBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTYuanMBk8KrLi9kaXN0LzIuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0HMCRkxzAwoavYmFzZUFzc2lnblZhbHVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kLBjcmVhdGVBZ2dyZWdhdG9ym6FpkMIGwJIHCMABwKdkZWZhdWx0kKtvYmplY3RQcm90b5uhbJGmT2JqZWN0wgoNkgsMwMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3Rvwg8SkhARwMDAwJGrb2JqZWN0UHJvdG+nY291bnRCeZuhbJOwY3JlYXRlQWdncmVnYXRvcq5oYXNPd25Qcm9wZXJ0ea9iYXNlQXNzaWduVmFsdWXCFBeSFRbAwMDAk69iYXNlQXNzaWduVmFsdWWwY3JlYXRlQWdncmVnYXRvcq5oYXNPd25Qcm9wZXJ0eahfZGVmYXVsdJuhbJGnY291bnRCecIZwJIaG8DAwMCQ3AAdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsPwMDCwpY4D8DAwsKWARYGCcLClgkAB8DCwpYLEMDAwsKWABDAEcLCljEBCg7CwpYEAAvAwsKWAAvADcLClgALwMDCwpYDEMDAwsKWMwEPE8LClgQAEMDCwpYADsASwsKWJw7ABMLClgMPDMDCwpbNAwEBFBjCwpYEABXAwsKWAAfAF8LClgQHwMDCwpYDGAjAwsKWAQEZHMLClgYBGsDCwpYACMAWwsKWCQjAwMLClgEOG8DCwg==
====catalogjs annotation end====*/