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

function baseConforms0(source) {
  var props = keys(source);
  return function (object) {
    return baseConformsTo(object, source, props);
  };
}

const baseConforms = (baseConforms0);



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

const _default = (conforms);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvNDAuanMBk8KtLi9kaXN0LzE1Ny5qcwWTwqkuL2tleXMuanMJgadkZWZhdWx0lKFsqF9kZWZhdWx0H8CRkx/AwoipYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kK5iYXNlQ29uZm9ybXNUb5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCka2V5c5uhaZDCCsCSCwzAAsCnZGVmYXVsdJCtYmFzZUNvbmZvcm1zMJuhbJKka2V5c65iYXNlQ29uZm9ybXNUb8INwJIOD8DAwMCQrGJhc2VDb25mb3Jtc5uhbJGtYmFzZUNvbmZvcm1zMMIRwJISE5LZW2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlQ29uZm9ybXMuanOnZGVmYXVsdMDAwJCvQ0xPTkVfREVFUF9GTEFHm6FskMIVwJIWF8DAwMCQqGNvbmZvcm1zm6Fsk6xiYXNlQ29uZm9ybXOpYmFzZUNsb25lr0NMT05FX0RFRVBfRkxBR8IYwJIZGsDAwMCQqF9kZWZhdWx0m6Fskahjb25mb3Jtc8IcwJIdHsDAwMCQ3AAglgAAAcDCw5YAFwIFwsKWCQADwMLClgsJwMDCwpYBCcAXwsKWARgGCcLClgkAB8DCwpYLDsDAwsKWMg7AwMLClgEUCg3CwpYJAAvAwsKWCwTAwMLClhkEwAjCwpbM5h8OEMLClgkNwAzCwpYEDcDAwsKWAgERFMLClgYBEsDCwpYADMAPwsKWFAzABMLCljIBFRjCwpYEBBbAwsKWAA/AwMLClgkPwMDCwpbNAr8FGRvCwpYJCMATwsKWBAjAwMLClgIBHB/CwpYGAR3AwsKWAAjAGsLClgkIwMDCwpYBDh7AwsI=
====catalogjs annotation end====*/