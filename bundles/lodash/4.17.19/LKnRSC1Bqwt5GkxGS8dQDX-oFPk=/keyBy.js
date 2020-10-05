import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";



/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the last element responsible for generating the key. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.keyBy(array, function(o) {
 *   return String.fromCharCode(o.code);
 * });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.keyBy(array, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 */

var keyBy = createAggregator(function (result, value, key) {
  baseAssignValue(result, key, value);
});
const _default = (keyBy);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTYuanMBk8KrLi9kaXN0LzIuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSvYmFzZUFzc2lnblZhbHVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kLBjcmVhdGVBZ2dyZWdhdG9ym6FpkMIGwJIHCMABwKdkZWZhdWx0kKVrZXlCeZuhbJKwY3JlYXRlQWdncmVnYXRvcq9iYXNlQXNzaWduVmFsdWXCCg2SCwzAwMDAkq9iYXNlQXNzaWduVmFsdWWwY3JlYXRlQWdncmVnYXRvcqhfZGVmYXVsdJuhbJGla2V5QnnCD8CSEBHAwMDAkNwAE5YAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWIw/AwMLClgEWBgnCwpYJAAfAwsKWCxDAwMLClgAQwATCwpbNA8IBCg7CwpYEAAvAwsKWAAXADcLClgQFwMDCwpYDGAjAwsKWAQEPEsLClgYBEMDCwpYACMAMwsKWCQjAwMLClgEOEcDCwg==
====catalogjs annotation end====*/