import { default as baseMerge } from "./dist/53.js";
import { default as createAssigner } from "./dist/48.js";



/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */

var merge = createAssigner(function (object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});
const _default = (merge);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTMuanMBk8KsLi9kaXN0LzQ4LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKEqWJhc2VNZXJnZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCuY3JlYXRlQXNzaWduZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQpW1lcmdlm6Fskq5jcmVhdGVBc3NpZ25lcqliYXNlTWVyZ2XCCg2SCwzAwMDAkqliYXNlTWVyZ2WuY3JlYXRlQXNzaWduZXKoX2RlZmF1bHSboWyRpW1lcmdlwg/AkhARwMDAwJDcABOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLClikJwMDCwpYBFwYJwsKWCQAHwMLClgsOwMDCwpYADsAEwsKWzQPoAQoOwsKWBAALwMLClgAFwA3CwpYEBcDAwsKWAx4IwMLClgEBDxLCwpYGARDAwsKWAAjADMLClgkIwMDCwpYBDhHAwsI=
====catalogjs annotation end====*/