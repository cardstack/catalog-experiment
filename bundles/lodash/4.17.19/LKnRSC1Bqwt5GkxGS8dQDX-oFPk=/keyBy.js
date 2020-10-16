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

export { keyBy as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNTYuanMBwsCVwqsuL2Rpc3QvMi5qcwXCwIGnZGVmYXVsdJShbKVrZXlCeQ7AkZMOwMCDr2Jhc2VBc3NpZ25WYWx1ZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCwY3JlYXRlQWdncmVnYXRvcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCla2V5QnmboWySsGNyZWF0ZUFnZ3JlZ2F0b3KvYmFzZUFzc2lnblZhbHVlwgoNkgsMwMDAwJKvYmFzZUFzc2lnblZhbHVlsGNyZWF0ZUFnZ3JlZ2F0b3KflgAAAcDCw5YAFwIFwsKWCQADwMLClgsPwMDCwpYjD8DAwsKWARYGCcLClgkAB8DCwpYLEMDAwsKWABDABMLCls0DwgEKDsLClgQAC8DCwpYABcANwsKWCQXAwMLClgMYCMDCwpYCDgzAwsI=
====catalogjs annotation end====*/