import { default as baseUpdate } from "./dist/13.js";
import { default as castFunction } from "./dist/108.js";



/**
 * This method is like `_.update` except that it accepts `customizer` which is
 * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
 * path creation is handled by the method instead. The `customizer` is invoked
 * with three arguments: (nsValue, key, nsObject).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {Function} updater The function to produce the updated value.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {};
 *
 * _.updateWith(object, '[0][1]', _.constant('a'), Object);
 * // => { '0': { '1': 'a' } }
 */

function updateWith(object, path, updater, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}


export { updateWith as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvMTMuanMBwsCVwq0uL2Rpc3QvMTA4LmpzBcLAgadkZWZhdWx0lKFsqnVwZGF0ZVdpdGgMwJGTDMDAg6piYXNlVXBkYXRlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxjYXN0RnVuY3Rpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQqnVwZGF0ZVdpdGiboWySqmJhc2VVcGRhdGWsY2FzdEZ1bmN0aW9uwgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpbMkgrACMLClgEYBgnCwpYJAAfAwsKWCwzAwMLClg8MwMDCwpbNA0sZCgzCwpYJCsAEwsKWCQrAwMLClgMOC8DCwg==
====catalogjs annotation end====*/