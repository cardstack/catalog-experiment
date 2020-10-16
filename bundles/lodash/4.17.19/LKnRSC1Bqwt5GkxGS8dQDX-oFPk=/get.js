import { default as baseGet } from "./dist/14.js";


/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */

function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}


export { get as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTQuanMBwsCBp2RlZmF1bHSUoWyjZ2V0CMCRkwjAwIKnYmFzZUdldJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCjZ2V0m6FskadiYXNlR2V0wgXAkgYHwMDAwJCZlgAAAcDCw5YAFwIFwsKWCQADwMLClgsHwMDCwpZLB8DAwsKWzQKUSAYIwsKWCQPABMLClgkDwMDCwpYDDgfAwsI=
====catalogjs annotation end====*/