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


export { result as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvMTcuanMBwsCVwq8uL2lzRnVuY3Rpb24uanMFwsCVwqwuL2Rpc3QvMjcuanMJwsCBp2RlZmF1bHSUoWymcmVzdWx0EMCRkxDAwISoY2FzdFBhdGiboWmQwgLAkgMEwADAp2RlZmF1bHSQqmlzRnVuY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQpXRvS2V5m6FpkMIKwJILDMACwKdkZWZhdWx0kKZyZXN1bHSboWyTqGNhc3RQYXRopXRvS2V5qmlzRnVuY3Rpb27CDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWKAjADMLClgEaBgnCwpYJAAfAwsKWCwrAwMLClnYKwMDCwpYBFwoNwsKWCQALwMLClgsFwMDCwpbNAQAFwAjCwpbNAzA9DhDCwpYJBsAEwsKWCQbAwMLClgMOD8DCwg==
====catalogjs annotation end====*/