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

export { invertBy as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvNi5qcwHCwJXCrC4vZGlzdC83Ni5qcwXCwIGnZGVmYXVsdJShbKhpbnZlcnRCeR7AkZMewMCGrGJhc2VJdGVyYXRlZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCuY3JlYXRlSW52ZXJ0ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQq29iamVjdFByb3Rvm6FskaZPYmplY3TCCg6TCwwNwMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3RvwhATkhESwMDAwJGrb2JqZWN0UHJvdG+0bmF0aXZlT2JqZWN0VG9TdHJpbmeboWyRq29iamVjdFByb3RvwhUYkhYXwMDAwJGrb2JqZWN0UHJvdG+oaW52ZXJ0QnmboWyUrmNyZWF0ZUludmVydGVytG5hdGl2ZU9iamVjdFRvU3RyaW5nrmhhc093blByb3BlcnR5rGJhc2VJdGVyYXRlZcIaHZIbHMDAwMCUrGJhc2VJdGVyYXRlZa5jcmVhdGVJbnZlcnRlcq5oYXNPd25Qcm9wZXJ0ebRuYXRpdmVPYmplY3RUb1N0cmluZ9wAH5YAAAHAwsOWABYCBcLClgkAA8DCwpYLDMDAwsKWYgzAwMLClgEXBgnCwpYJAAfAwsKWCw7AwMLClgAOwBfCwpYxAQoPwsKWBAALwMLClgALwA7CwpYAC8DAwsKWAAvAwMLClgMQwMDCwpYzARAUwsKWBAARwMLClgAOwBPCwpYZDsAEwsKWAw8MwMLClsyNARUZwsKWBAAWwMLClgAUwBjCwpZrFMASwsKWAwkNwMLCls0DTAEaHsLClgQAG8DCwpYACMAdwsKWCQjAwMLClgMBCMDCwpYCDhzAwsI=
====catalogjs annotation end====*/