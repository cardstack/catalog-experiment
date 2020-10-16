import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";



/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */

var groupBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});

export { groupBy as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNTYuanMBwsCVwqsuL2Rpc3QvMi5qcwXCwIGnZGVmYXVsdJShbKdncm91cEJ5GMCRkxjAwIWvYmFzZUFzc2lnblZhbHVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kLBjcmVhdGVBZ2dyZWdhdG9ym6FpkMIGwJIHCMABwKdkZWZhdWx0kKtvYmplY3RQcm90b5uhbJGmT2JqZWN0wgoNkgsMwMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3Rvwg8SkhARwMDAwJGrb2JqZWN0UHJvdG+nZ3JvdXBCeZuhbJOwY3JlYXRlQWdncmVnYXRvcq5oYXNPd25Qcm9wZXJ0ea9iYXNlQXNzaWduVmFsdWXCFBeSFRbAwMDAk69iYXNlQXNzaWduVmFsdWWwY3JlYXRlQWdncmVnYXRvcq5oYXNPd25Qcm9wZXJ0edwAGZYAAAHAwsOWABcCBcLClgkAA8DCwpYLD8DAwsKWQg/AwMLClgEWBgnCwpYJAAfAwsKWCxDAwMLClgAQwBHCwpYxAQoOwsKWBAALwMLClgALwA3CwpYAC8DAwsKWAxDAwMLCljMBDxPCwpYEABDAwsKWAA7AEsLClicOwATCwpYDDwzAwsKWzQN6ARQYwsKWBAAVwMLClgAHwBfCwpYJB8DAwsKWAx4IwMLClgIOFsDCwg==
====catalogjs annotation end====*/