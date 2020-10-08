import { default as hasPath } from "./dist/15.js";

/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */

function baseHas0(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

const baseHas = (baseHas0);



/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */

function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

const _default = (has);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMTUuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0HcCRkx3AwoenaGFzUGF0aJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrb2JqZWN0UHJvdG+boWyRpk9iamVjdMIGCZIHCMDAwMCQrmhhc093blByb3BlcnR5m6FskatvYmplY3RQcm90b8ILDpIMDcDAwMCRq29iamVjdFByb3RvqGJhc2VIYXMwm6Fska5oYXNPd25Qcm9wZXJ0ecIPwJIQEcDAwMCQp2Jhc2VIYXOboWyRqGJhc2VIYXMwwhPAkhQVktlWaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VIYXMuanOnZGVmYXVsdMDAwJCjaGFzm6FskqdoYXNQYXRop2Jhc2VIYXPCFsCSFxjAwMDAkKhfZGVmYXVsdJuhbJGjaGFzwhrAkhscwMDAwJDcAB6WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwfAwMLCliwHwBXCwpYuAQYKwsKWBAAHwMLClgALwAnCwpYAC8DAwsKWAxDAwMLCljMBCw/CwpYEAAzAwsKWAA7ADsLClisOwMDCwpYDDwjAwsKWzQEDFRASwsKWCQjADcLClgQIwMDCwpYCARMWwsKWBgEUwMLClgAHwBHCwpYPB8DAwsKWzQI+BBcZwsKWCQPABMLClgQDwMDCwpYCARodwsKWBgEbwMLClgAIwBjCwpYJCMDAwsKWAQ4cwMLC
====catalogjs annotation end====*/