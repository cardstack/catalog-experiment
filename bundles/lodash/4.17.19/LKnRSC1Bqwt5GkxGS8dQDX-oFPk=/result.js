import { default as castPath } from "./dist/17.js";
import { default as isFunction } from "./isFunction.js";
import { default as toKey } from "./dist/27.js";




/**
 * This method is like `_.get` except that if the resolved value is a
 * function it's invoked with the `this` binding of its parent object and
 * its result is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to resolve.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
 *
 * _.result(object, 'a[0].b.c1');
 * // => 3
 *
 * _.result(object, 'a[0].b.c2');
 * // => 4
 *
 * _.result(object, 'a[0].b.c3', 'default');
 * // => 'default'
 *
 * _.result(object, 'a[0].b.c3', _.constant('default'));
 * // => 'default'
 */

function result(object, path, defaultValue) {
  path = castPath(path, object);
  var index = -1,
      length = path.length; // Ensure the loop is entered when path is empty.

  if (!length) {
    length = 1;
    object = undefined;
  }

  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];

    if (value === undefined) {
      index = length;
      value = defaultValue;
    }

    object = isFunction(value) ? value.call(object) : value;
  }

  return object;
}

const _default = (result);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvMTcuanMBk8KvLi9pc0Z1bmN0aW9uLmpzBZPCrC4vZGlzdC8yNy5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQUwJGTFMDChahjYXN0UGF0aJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqaXNGdW5jdGlvbpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCldG9LZXmboWmQwgrAkgsMwALAp2RlZmF1bHSQpnJlc3VsdJuhbJOoY2FzdFBhdGildG9LZXmqaXNGdW5jdGlvbsINwJIOD8DAwMCQqF9kZWZhdWx0m6FskaZyZXN1bHTCEcCSEhPAwMDAkNwAFZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWKAjADMLClgEaBgnCwpYJAAfAwsKWCwrAwMLClnYKwMDCwpYBFwoNwsKWCQALwMLClgsFwMDCwpbNAQAFwAjCwpbNAzA9DhDCwpYJBsAEwsKWBAbAwMLClgIBERTCwpYGARLAwsKWAAjAD8LClgkIwMDCwpYBDhPAwsI=
====catalogjs annotation end====*/