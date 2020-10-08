import { default as Symbol } from "./dist/87.js";
import { default as copyArray } from "./dist/117.js";
import { default as getTag } from "./dist/45.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as mapToArray } from "./dist/153.js";
import { default as setToArray } from "./dist/154.js";
import { default as stringToArray } from "./dist/143.js";
import { default as values } from "./values.js";

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray0(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }

  return result;
}

const iteratorToArray = (iteratorToArray0);











/** `Object#toString` result references. */

var mapTag = '[object Map]',
    setTag = '[object Set]';
/** Built-in value references. */

var symIterator = Symbol ? Symbol.iterator : undefined;
/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */

function toArray(value) {
  if (!value) {
    return [];
  }

  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }

  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }

  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
  return func(value);
}

const _default = (toArray);
export { _default as default };
/*====catalogjs annotation start====
lZmTwqwuL2Rpc3QvODcuanMBk8KtLi9kaXN0LzExNy5qcwaTwqwuL2Rpc3QvNDUuanMKk8KwLi9pc0FycmF5TGlrZS5qcw6Twq0uL2lzU3RyaW5nLmpzEpPCrS4vZGlzdC8xNTMuanMWk8KtLi9kaXN0LzE1NC5qcxqTwq0uL2Rpc3QvMTQzLmpzHpPCqy4vdmFsdWVzLmpzIoGnZGVmYXVsdJShbKhfZGVmYXVsdELAkZNCwMLeABCmU3ltYm9sm6FpkMICwJMDBAXAAMCnZGVmYXVsdJCpY29weUFycmF5m6FpkMIHwJIICcABwKdkZWZhdWx0kKZnZXRUYWeboWmQwgvAkgwNwALAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6FpkMIPwJIQEcADwKdkZWZhdWx0kKhpc1N0cmluZ5uhaZDCE8CSFBXABMCnZGVmYXVsdJCqbWFwVG9BcnJheZuhaZDCF8CSGBnABcCnZGVmYXVsdJCqc2V0VG9BcnJheZuhaZDCG8CSHB3ABsCnZGVmYXVsdJCtc3RyaW5nVG9BcnJheZuhaZDCH8CSICHAB8CnZGVmYXVsdJCmdmFsdWVzm6FpkMIjwJIkJcAIwKdkZWZhdWx0kLBpdGVyYXRvclRvQXJyYXkwm6FskMImwJInKMDAwMCQr2l0ZXJhdG9yVG9BcnJheZuhbJGwaXRlcmF0b3JUb0FycmF5MMIqwJIrLJLZXmh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19pdGVyYXRvclRvQXJyYXkuanOnZGVmYXVsdMDAwJCmbWFwVGFnm6FskMIuwJIvMMDAwMCQpnNldFRhZ5uhbJDCMcCSMjPAwMDAkKtzeW1JdGVyYXRvcpuhbJKmU3ltYm9sqXVuZGVmaW5lZMI1OpQ2Nzg5wMDAwJGmU3ltYm9sp3RvQXJyYXmboWycq2lzQXJyYXlMaWtlqGlzU3RyaW5nrXN0cmluZ1RvQXJyYXmpY29weUFycmF5q3N5bUl0ZXJhdG9yr2l0ZXJhdG9yVG9BcnJheaZnZXRUYWembWFwVGFnqm1hcFRvQXJyYXmmc2V0VGFnqnNldFRvQXJyYXmmdmFsdWVzwjvAkjw9wMDAwJCoX2RlZmF1bHSboWyRp3RvQXJyYXnCP8CSQEHAwMDAkNwAQ5YAAAHAwsOWABcCBsLClgkAA8DCwpYLBsDAwsKWAAbABcLClgMGwMDCwpYBGAcKwsKWCQAIwMLClgsJwMDCwpYKCcA3wsKWARcLDsLClgkADMDCwpYLBsDAwsKWFwbAMMLClgEbDxLCwpYJABDAwsKWCwvAwMLCljQLwBXCwpYBGBMWwsKWCQAUwMLClgsIwMDCwpYWCMAhwsKWARgXGsLClgkAGMDCwpYLCsDAwsKWAwrAM8LClgEYGx7CwpYJABzAwsKWCwrAwMLClgMKwCXCwpYBGB8iwsKWCQAgwMLClgsNwMDCwpYKDcAJwsKWARYjJsLClgkAJMDCwpYLBsDAwsKWAwbAwMLClsyjzIwnKcLClgkQwMDCwpYEEMDAwsKWAgEqLcLClgYBK8DCwpYAD8AowsKWEA/AOcLCljkBLjTCwpYEES8xwsKWAAbAwMLClh0GwBnCwpYGETLAwsKWAAbAwMLClgoGwB3CwpYkATU7wsKWBAA2wMLClgALwDrCwpYUC8A4wsKWCgvALMLClgcLwA3CwpYDFQTAwsKWzQF6GTw+wsKWCQfAEcLClgQHwMDCwpYCAT9CwsKWBgFAwMLClgAIwD3CwpYJCMDAwsKWAQ5BwMLC
====catalogjs annotation end====*/