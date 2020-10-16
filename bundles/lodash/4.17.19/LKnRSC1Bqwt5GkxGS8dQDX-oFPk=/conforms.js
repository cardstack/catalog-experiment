import { default as baseClone } from "./dist/40.js";
import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";



/**
 * The base implementation of `_.conforms` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 */

function baseConforms(source) {
  var props = keys(source);
  return function (object) {
    return baseConformsTo(object, source, props);
  };
}





/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1;
/**
 * Creates a function that invokes the predicate properties of `source` with
 * the corresponding property values of a given object, returning `true` if
 * all predicates return truthy, else `false`.
 *
 * **Note:** The created function is equivalent to `_.conformsTo` with
 * `source` partially applied.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var objects = [
 *   { 'a': 2, 'b': 1 },
 *   { 'a': 1, 'b': 2 }
 * ];
 *
 * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
 * // => [{ 'a': 1, 'b': 2 }]
 */

function conforms(source) {
  return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
}


export { conforms as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvNDAuanMBwsCVwq0uL2Rpc3QvMTU3LmpzBcLAlcKpLi9rZXlzLmpzCcLAgadkZWZhdWx0lKFsqGNvbmZvcm1zF8CRkxfAwIapYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kK5iYXNlQ29uZm9ybXNUb5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCka2V5c5uhaZDCCsCSCwzAAsCnZGVmYXVsdJCsYmFzZUNvbmZvcm1zm6FskqRrZXlzrmJhc2VDb25mb3Jtc1Rvwg3Akg4PktlbaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Jhc2VDb25mb3Jtcy5qc6dkZWZhdWx0wMDAkK9DTE9ORV9ERUVQX0ZMQUeboWyQwhHAkhITwMDAwJCoY29uZm9ybXOboWyTrGJhc2VDb25mb3Jtc6liYXNlQ2xvbmWvQ0xPTkVfREVFUF9GTEFHwhTAkhUWwMDAwJDcABiWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLClgEJwBPCwpYBGAYJwsKWCQAHwMLClgsOwMDCwpYyDsDAwsKWARQKDcLClgkAC8DCwpYLBMDAwsKWGQTACMLClszmHw4QwsKWCQzADMLClhQMwATCwpY0AREUwsKWBAQSwMLClgAPwMDCwpYJD8DAwsKWzQK/BRUXwsKWCQjAD8LClgkIwMDCwpYDDhbAwsI=
====catalogjs annotation end====*/