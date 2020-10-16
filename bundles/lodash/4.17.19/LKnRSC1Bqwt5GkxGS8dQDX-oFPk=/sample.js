import { default as baseRandom } from "./dist/171.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";


/**
 * A specialized version of `_.sample` for arrays.
 *
 * @private
 * @param {Array} array The array to sample.
 * @returns {*} Returns the random element.
 */

function arraySample(array) {
  var length = array.length;
  return length ? array[baseRandom(0, length - 1)] : undefined;
}





/**
 * The base implementation of `_.sample`.
 *
 * @private
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 */

function baseSample(collection) {
  return arraySample(values(collection));
}






/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */

function sample(collection) {
  var func = isArray(collection) ? arraySample : baseSample;
  return func(collection);
}


export { sample as default };
/*====catalogjs annotation start====
lZOVwq0uL2Rpc3QvMTcxLmpzAcLAlcKrLi92YWx1ZXMuanMFwsCVwqwuL2lzQXJyYXkuanMJwsCBp2RlZmF1bHSUoWymc2FtcGxlF8CRkxfAwIaqYmFzZVJhbmRvbZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCmdmFsdWVzm6FpkMIGwJIHCMABwKdkZWZhdWx0kKdpc0FycmF5m6FpkMIKwJILDMACwKdkZWZhdWx0kKthcnJheVNhbXBsZZuhbJGqYmFzZVJhbmRvbcINwJMODxCS2VpodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYXJyYXlTYW1wbGUuanOnZGVmYXVsdMDAwJCqYmFzZVNhbXBsZZuhbJKrYXJyYXlTYW1wbGWmdmFsdWVzwhHAkhITktlZaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VTYW1wbGUuanOnZGVmYXVsdMDAwJCmc2FtcGxlm6Fsk6dpc0FycmF5q2FycmF5U2FtcGxlqmJhc2VTYW1wbGXCFMCSFRbAwMDAkNwAGJYAAAHAwsOWABgCBcLClgkAA8DCwpYLCsDAwsKWPwrAwMLClgEWBgnCwpYJAAfAwsKWCwbAwMLClgEGwMDCwpYBFwoNwsKWCQALwMLClgsHwMDCwpYcB8AQwsKWzKcfDhHCwpYJC8AEwsKWGAvACMLClg8LwBPCwpbMshASFMLClgkKwA/CwpYDCsDAwsKWzQEgHhUXwsKWCQbADMLClgkGwMDCwpYDDhbAwsI=
====catalogjs annotation end====*/