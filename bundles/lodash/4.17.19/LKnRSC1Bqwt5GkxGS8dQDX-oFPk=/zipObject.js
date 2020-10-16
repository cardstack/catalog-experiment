import { default as assignValue } from "./dist/55.js";
import { default as baseZipObject } from "./dist/174.js";



/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */

function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}


export { zipObject as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNTUuanMBwsCVwq0uL2Rpc3QvMTc0LmpzBcLAgadkZWZhdWx0lKFsqXppcE9iamVjdAzAkZMMwMCDq2Fzc2lnblZhbHVlm6FpkMICwJIDBMAAwKdkZWZhdWx0kK1iYXNlWmlwT2JqZWN0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKl6aXBPYmplY3SboWySrWJhc2VaaXBPYmplY3SrYXNzaWduVmFsdWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClhwLwMDCwpYBGAYJwsKWCQAHwMLClgsNwMDCwpYbDcAEwsKWzQG7BAoMwsKWCQnACMLClgkJwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/