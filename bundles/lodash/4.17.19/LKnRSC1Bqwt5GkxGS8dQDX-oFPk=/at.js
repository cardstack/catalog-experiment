import { default as baseAt } from "./dist/1.js";
import { default as flatRest } from "./dist/50.js";



/**
 * Creates an array of values corresponding to `paths` of `object`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Array} Returns the picked values.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _.at(object, ['a[0].b.c', 'a[1]']);
 * // => [3, 4]
 */

var at = flatRest(baseAt);

export { at as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvMS5qcwHCwJXCrC4vZGlzdC81MC5qcwXCwIGnZGVmYXVsdJShbKJhdA7AkZMOwMCDpmJhc2VBdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCoZmxhdFJlc3SboWmQwgbAkgcIwAHAp2RlZmF1bHSQomF0m6FskqhmbGF0UmVzdKZiYXNlQXTCCg2SCwzAwMDAkqZiYXNlQXSoZmxhdFJlc3SflgAAAcDCw5YAFgIFwsKWCQADwMLClgsGwMDCwpYBBsDAwsKWARcGCcLClgkAB8DCwpYLCMDAwsKWAAjABMLCls0BuAEKDsLClgQAC8DCwpYAAsANwsKWCQLAwMLClgMBCMDCwpYCDgzAwsI=
====catalogjs annotation end====*/