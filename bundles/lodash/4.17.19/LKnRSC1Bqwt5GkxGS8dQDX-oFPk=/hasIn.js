import { default as hasPath } from "./dist/15.js";

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn0(object, key) {
  return object != null && key in Object(object);
}

const baseHasIn = (baseHasIn0);



/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */

function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

const _default = (hasIn);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMTUuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0E8CRkxPAwoWnaGFzUGF0aJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqYmFzZUhhc0luMJuhbJDCBcCSBgfAwMDAkKliYXNlSGFzSW6boWyRqmJhc2VIYXNJbjDCCcCSCguS2VhodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZUhhc0luLmpzp2RlZmF1bHTAwMCQpWhhc0lum6FskqdoYXNQYXRoqWJhc2VIYXNJbsIMwJINDsDAwMCQqF9kZWZhdWx0m6FskaVoYXNJbsIQwJIREsDAwMCQ3AAUlgAAAcDCw5YAFwIFwsKWCQADwMLClgsHwMDCwpYsB8ALwsKWzQEFQwYIwsKWCQrAwMLClgQKwMDCwpYCAQkMwsKWBgEKwMLClgAJwAfCwpYPCcDAwsKWzQIwBA0PwsKWCQXABMLClgQFwMDCwpYCARATwsKWBgERwMLClgAIwA7CwpYJCMDAwsKWAQ4SwMLC
====catalogjs annotation end====*/