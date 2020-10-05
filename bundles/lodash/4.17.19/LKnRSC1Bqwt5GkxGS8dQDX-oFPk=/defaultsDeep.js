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

function customDefaultsMerge0(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge0, stack);
    stack['delete'](srcValue);
  }

  return objValue;
}

const customDefaultsMerge = (customDefaultsMerge0);





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
const _default = (defaultsDeep);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTExLmpzAZPCrC4vZGlzdC80OS5qcwWTwqwuL2Rpc3QvNTMuanMJk8KtLi9pc09iamVjdC5qcw2Twq4uL21lcmdlV2l0aC5qcxKBp2RlZmF1bHSUoWyoX2RlZmF1bHQnwJGTJ8DCiaVhcHBseZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWJhc2VNZXJnZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoaXNPYmplY3SboWmQwg7Akw8QEcADwKdkZWZhdWx0kKltZXJnZVdpdGiboWmQwhPAkhQVwATAp2RlZmF1bHSQtGN1c3RvbURlZmF1bHRzTWVyZ2Uwm6Fsk6hpc09iamVjdKliYXNlTWVyZ2W0Y3VzdG9tRGVmYXVsdHNNZXJnZTDCFsCTFxgZwMDAwJCzY3VzdG9tRGVmYXVsdHNNZXJnZZuhbJG0Y3VzdG9tRGVmYXVsdHNNZXJnZTDCG8CSHB3AwMDAkKxkZWZhdWx0c0RlZXCboWyUqGJhc2VSZXN0s2N1c3RvbURlZmF1bHRzTWVyZ2WlYXBwbHmpbWVyZ2VXaXRowh8ikiAhwMDAwJSlYXBwbHmoYmFzZVJlc3SpbWVyZ2VXaXRos2N1c3RvbURlZmF1bHRzTWVyZ2WoX2RlZmF1bHSboWyRrGRlZmF1bHRzRGVlcMIkwJIlJsDAwMCQ3AAolgAAAcDCw5YAGAIFwsKWCQADwMLClgsFwMDCwpYMBcAVwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjAHcLClgEXCg3CwpYJAAvAwsKWCwnAwMLClsyFCcAYwsKWARgOEsLClgkAD8DCwpYLCMDAwsKWOQjAEcLClg4IwAzCwpYBGRMWwsKWCQAUwMLClgsJwMDCwpYBCcDAwsKWzQIxQhcawsKWCRTAEMLCliAUwMDCwpYEFMDAwsKWAgEbHsLClgYBHMDCwpYAE8AZwsKWKhPABMLCls0B9gEfI8LClgQAIMDCwpYADMAiwsKWBAzAwMLClgMWCMDCwpYBASQnwsKWBgElwMLClgAIwCHCwpYJCMDAwsKWAQ4mwMLC
====catalogjs annotation end====*/