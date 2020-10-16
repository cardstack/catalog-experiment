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


export { propertyOf as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMTQuanMBwsCBp2RlZmF1bHSUoWyqcHJvcGVydHlPZgjAkZMIwMCCp2Jhc2VHZXSboWmQwgLAkgMEwADAp2RlZmF1bHSQqnByb3BlcnR5T2aboWyRp2Jhc2VHZXTCBcCSBgfAwMDAkJmWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwfAwMLClk4HwMDCwpbNAh4WBgjCwpYJCsAEwsKWCQrAwMLClgMOB8DCwg==
====catalogjs annotation end====*/