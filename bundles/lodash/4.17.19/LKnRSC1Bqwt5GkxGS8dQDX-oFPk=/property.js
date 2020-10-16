import { default as baseProperty } from "./dist/156.js";
import { default as baseGet } from "./dist/14.js";
import { default as isKey } from "./dist/26.js";
import { default as toKey } from "./dist/27.js";


/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */

function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}







/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */

function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}


export { property as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTU2LmpzAcLAlcKsLi9kaXN0LzE0LmpzBcLAlcKsLi9kaXN0LzI2LmpzCcLAlcKsLi9kaXN0LzI3LmpzDcLAgadkZWZhdWx0lKFsqHByb3BlcnR5F8CRkxfAwIasYmFzZVByb3BlcnR5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKdiYXNlR2V0m6FpkMIGwJIHCMABwKdkZWZhdWx0kKVpc0tleZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCldG9LZXmboWmQwg7Akg8QwAPAp2RlZmF1bHSQsGJhc2VQcm9wZXJ0eURlZXCboWyRp2Jhc2VHZXTCEcCSEhOS2V9odHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYmFzZVByb3BlcnR5RGVlcC5qc6dkZWZhdWx0wMDAkKhwcm9wZXJ0eZuhbJSlaXNLZXmsYmFzZVByb3BlcnR5pXRvS2V5sGJhc2VQcm9wZXJ0eURlZXDCFMCSFRbAwMDAkNwAGJYAAAHAwsOWABgCBcLClgkAA8DCwpYLDMDAwsKWCQzAEMLClgEXBgnCwpYJAAfAwsKWCwfAwMLCljEHwMDCwpYBFwoNwsKWCQALwMLClgsFwMDCwpYSBcAEwsKWARcOEcLClgkAD8DCwpYLBcDAwsKWAQXAE8LClszaFhIUwsKWCRDACMLClgoQwMDCwpbNAfYJFRfCwpYJCMAMwsKWCQjAwMLClgMOFsDCwg==
====catalogjs annotation end====*/