import { default as baseGet } from "./dist/14.js";


/**
 * The opposite of `_.property`; this method creates a function that returns
 * the value at a given path of `object`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var array = [0, 1, 2],
 *     object = { 'a': array, 'b': array, 'c': array };
 *
 * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
 * // => [2, 0]
 *
 * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
 * // => [2, 0]
 */

function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}

const _default = (propertyOf);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMTQuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOnYmFzZUdldJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqcHJvcGVydHlPZpuhbJGnYmFzZUdldMIFwJIGB8DAwMCQqF9kZWZhdWx0m6Fskapwcm9wZXJ0eU9mwgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsHwMDCwpZOB8DAwsKWzQIeFgYIwsKWCQrABMLClgQKwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/