import { default as apply } from "./dist/111.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseMerge } from "./dist/53.js";
import { default as isObject } from "./isObject.js";
import { default as mergeWith } from "./mergeWith.js";



/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
 * objects into destination objects that are passed thru.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */

function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }

  return objValue;
}







/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */

var defaultsDeep = baseRest(function (args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

export { defaultsDeep as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTExLmpzAcLAlcKsLi9kaXN0LzQ5LmpzBcLAlcKsLi9kaXN0LzUzLmpzCcLAlcKtLi9pc09iamVjdC5qcw3CwJXCri4vbWVyZ2VXaXRoLmpzEsLAgadkZWZhdWx0lKFsrGRlZmF1bHRzRGVlcB/AkZMfwMCHpWFwcGx5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpYmFzZU1lcmdlm6FpkMIKwJILDMACwKdkZWZhdWx0kKhpc09iamVjdJuhaZDCDsCTDxARwAPAp2RlZmF1bHSQqW1lcmdlV2l0aJuhaZDCE8CSFBXABMCnZGVmYXVsdJCzY3VzdG9tRGVmYXVsdHNNZXJnZZuhbJOoaXNPYmplY3SpYmFzZU1lcmdls2N1c3RvbURlZmF1bHRzTWVyZ2XCFsCTFxgZktliaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2N1c3RvbURlZmF1bHRzTWVyZ2UuanOnZGVmYXVsdMDAwJCsZGVmYXVsdHNEZWVwm6FslKhiYXNlUmVzdLNjdXN0b21EZWZhdWx0c01lcmdlpWFwcGx5qW1lcmdlV2l0aMIbHpIcHcDAwMCUpWFwcGx5qGJhc2VSZXN0qW1lcmdlV2l0aLNjdXN0b21EZWZhdWx0c01lcmdl3AAglgAAAcDCw5YAGAIFwsKWCQADwMLClgsFwMDCwpYMBcAVwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjAGcLClgEXCg3CwpYJAAvAwsKWCwnAwMLClsyFCcAYwsKWARgOEsLClgkAD8DCwpYLCMDAwsKWOQjAEcLClg4IwAzCwpYBGRMWwsKWCQAUwMLClgsJwMDCwpYBCcDAwsKWzQIxQhcawsKWCRPAEMLCliATwMDCwpYqE8AEwsKWzQH4ARsfwsKWBAAcwMLClgAMwB7CwpYJDMDAwsKWAxYIwMLClgIOHcDCwg==
====catalogjs annotation end====*/