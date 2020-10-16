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


export { unset as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTAuanMBwsCBp2RlZmF1bHSUoWyldW5zZXQIwJGTCMDAgqliYXNlVW5zZXSboWmQwgLAkgMEwADAp2RlZmF1bHSQpXVuc2V0m6FskaliYXNlVW5zZXTCBcCSBgfAwMDAkJmWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLCljIJwMDCwpbNAooRBgjCwpYJBcAEwsKWCQXAwMLClgMOB8DCwg==
====catalogjs annotation end====*/