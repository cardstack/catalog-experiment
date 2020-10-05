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

const _default = (zipObject);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTUuanMBk8KtLi9kaXN0LzE3NC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKthc3NpZ25WYWx1ZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtYmFzZVppcE9iamVjdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpemlwT2JqZWN0m6Fskq1iYXNlWmlwT2JqZWN0q2Fzc2lnblZhbHVlwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRqXppcE9iamVjdMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYcC8DAwsKWARgGCcLClgkAB8DCwpYLDcDAwsKWGw3ABMLCls0BuwQKDMLClgkJwAjCwpYECcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/