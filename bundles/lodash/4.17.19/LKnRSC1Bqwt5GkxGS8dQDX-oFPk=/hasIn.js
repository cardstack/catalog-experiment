import { default as hasPath } from "./dist/15.js";

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}





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


export { hasIn as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTUuanMBwsCBp2RlZmF1bHSUoWylaGFzSW4LwJGTC8DAg6doYXNQYXRom6FpkMICwJIDBMAAwKdkZWZhdWx0kKliYXNlSGFzSW6boWyQwgXAkgYHktlYaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VIYXNJbi5qc6dkZWZhdWx0wMDAkKVoYXNJbpuhbJKnaGFzUGF0aKliYXNlSGFzSW7CCMCSCQrAwMDAkJyWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwfAwMLCliwHwAfCwpbNAQVDBgjCwpYJCcDAwsKWDwnAwMLCls0CMgQJC8LClgkFwATCwpYJBcDAwsKWAw4KwMLC
====catalogjs annotation end====*/