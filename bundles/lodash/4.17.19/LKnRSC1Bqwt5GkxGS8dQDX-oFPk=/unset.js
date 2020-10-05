import { default as baseUnset } from "./dist/10.js";


/**
 * Removes the property at `path` of `object`.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 7 } }] };
 * _.unset(object, 'a[0].b.c');
 * // => true
 *
 * console.log(object);
 * // => { 'a': [{ 'b': {} }] };
 *
 * _.unset(object, ['a', '0', 'b', 'c']);
 * // => true
 *
 * console.log(object);
 * // => { 'a': [{ 'b': {} }] };
 */

function unset(object, path) {
  return object == null ? true : baseUnset(object, path);
}

const _default = (unset);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMTAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DMCRkwzAwoOpYmFzZVVuc2V0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKV1bnNldJuhbJGpYmFzZVVuc2V0wgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRpXVuc2V0wgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsJwMDCwpYyCcDAwsKWzQKKEQYIwsKWCQXABMLClgQFwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/