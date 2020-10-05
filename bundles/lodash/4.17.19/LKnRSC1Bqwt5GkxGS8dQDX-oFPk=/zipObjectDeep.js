import { default as baseSet } from "./dist/16.js";
import { default as baseZipObject } from "./dist/174.js";



/**
 * This method is like `_.zipObject` except that it supports property paths.
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
 * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
 */

function zipObjectDeep(props, values) {
  return baseZipObject(props || [], values || [], baseSet);
}

const _default = (zipObjectDeep);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvMTYuanMBk8KtLi9kaXN0LzE3NC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKdiYXNlU2V0m6FpkMICwJIDBMAAwKdkZWZhdWx0kK1iYXNlWmlwT2JqZWN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kK16aXBPYmplY3REZWVwm6Fskq1iYXNlWmlwT2JqZWN0p2Jhc2VTZXTCCcCSCgvAwMDAkKhfZGVmYXVsdJuhbJGtemlwT2JqZWN0RGVlcMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsHwMDCwpYcB8DAwsKWARgGCcLClgkAB8DCwpYLDcDAwsKWGw3ABMLCls0BqgQKDMLClgkNwAjCwpYEDcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/