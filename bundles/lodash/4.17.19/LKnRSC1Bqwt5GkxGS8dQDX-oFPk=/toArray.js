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
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }

  return result;
}













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


export { toArray as default };
/*====catalogjs annotation start====
lZmVwqwuL2Rpc3QvODcuanMBwsCVwq0uL2Rpc3QvMTE3LmpzBsLAlcKsLi9kaXN0LzQ1LmpzCsLAlcKwLi9pc0FycmF5TGlrZS5qcw7CwJXCrS4vaXNTdHJpbmcuanMSwsCVwq0uL2Rpc3QvMTUzLmpzFsLAlcKtLi9kaXN0LzE1NC5qcxrCwJXCrS4vZGlzdC8xNDMuanMewsCVwqsuL3ZhbHVlcy5qcyLCwIGnZGVmYXVsdJShbKd0b0FycmF5OsCRkzrAwI6mU3ltYm9sm6FpkMICwJMDBAXAAMCnZGVmYXVsdJCpY29weUFycmF5m6FpkMIHwJIICcABwKdkZWZhdWx0kKZnZXRUYWeboWmQwgvAkgwNwALAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6FpkMIPwJIQEcADwKdkZWZhdWx0kKhpc1N0cmluZ5uhaZDCE8CSFBXABMCnZGVmYXVsdJCqbWFwVG9BcnJheZuhaZDCF8CSGBnABcCnZGVmYXVsdJCqc2V0VG9BcnJheZuhaZDCG8CSHB3ABsCnZGVmYXVsdJCtc3RyaW5nVG9BcnJheZuhaZDCH8CSICHAB8CnZGVmYXVsdJCmdmFsdWVzm6FpkMIjwJIkJcAIwKdkZWZhdWx0kK9pdGVyYXRvclRvQXJyYXmboWyQwibAkicoktleaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2l0ZXJhdG9yVG9BcnJheS5qc6dkZWZhdWx0wMDAkKZtYXBUYWeboWyQwirAkisswMDAwJCmc2V0VGFnm6FskMItwJIuL8DAwMCQq3N5bUl0ZXJhdG9ym6FskqZTeW1ib2ypdW5kZWZpbmVkwjE2lDIzNDXAwMDAkaZTeW1ib2yndG9BcnJheZuhbJyraXNBcnJheUxpa2WoaXNTdHJpbmetc3RyaW5nVG9BcnJhealjb3B5QXJyYXmrc3ltSXRlcmF0b3KvaXRlcmF0b3JUb0FycmF5pmdldFRhZ6ZtYXBUYWeqbWFwVG9BcnJheaZzZXRUYWeqc2V0VG9BcnJheaZ2YWx1ZXPCN8CSODnAwMDAkNwAO5YAAAHAwsOWABcCBsLClgkAA8DCwpYLBsDAwsKWAAbABcLClgMGwMDCwpYBGAcKwsKWCQAIwMLClgsJwMDCwpYKCcAzwsKWARcLDsLClgkADMDCwpYLBsDAwsKWFwbALMLClgEbDxLCwpYJABDAwsKWCwvAwMLCljQLwBXCwpYBGBMWwsKWCQAUwMLClgsIwMDCwpYWCMAhwsKWARgXGsLClgkAGMDCwpYLCsDAwsKWAwrAL8LClgEYGx7CwpYJABzAwsKWCwrAwMLClgMKwCXCwpYBGB8iwsKWCQAgwMLClgsNwMDCwpYKDcAJwsKWARYjJsLClgkAJMDCwpYLBsDAwsKWAwbAwMLClsyjzIwnKcLClgkPwMDCwpYQD8A1wsKWOwEqMMLClgQRKy3CwpYABsDAwsKWHQbAGcLClgYRLsDCwpYABsDAwsKWCgbAHcLCliQBMTfCwpYEADLAwsKWAAvANsLClhQLwDTCwpYKC8AowsKWBwvADcLClgMVBMDCwpbNAXoZODrCwpYJB8ARwsKWCQfAwMLClgMOOcDCwg==
====catalogjs annotation end====*/