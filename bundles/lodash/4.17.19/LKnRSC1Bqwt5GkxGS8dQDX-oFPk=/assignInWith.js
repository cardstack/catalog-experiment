import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keysIn } from "./keysIn.js";




/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */

var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

export { assignInWith as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvNTQuanMBwsCVwqwuL2Rpc3QvNDguanMFwsCVwqsuL2tleXNJbi5qcwnCwIGnZGVmYXVsdJShbKxhc3NpZ25JbldpdGgSwJGTEsDAhKpjb3B5T2JqZWN0m6FpkMICwJIDBMAAwKdkZWZhdWx0kK5jcmVhdGVBc3NpZ25lcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCma2V5c0lum6FpkMIKwJILDMACwKdkZWZhdWx0kKxhc3NpZ25JbldpdGiboWyTrmNyZWF0ZUFzc2lnbmVyqmNvcHlPYmplY3Sma2V5c0luwg4Rkg8QwMDAwJOqY29weU9iamVjdK5jcmVhdGVBc3NpZ25lcqZrZXlzSW7cABOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLCljUKwAzCwpYBFwYJwsKWCQAHwMLClgsOwMDCwpYADsAEwsKWARYKDcLClgkAC8DCwpYLBsDAwsKWCQbAwMLCls0DvAEOEsLClgQAD8DCwpYADMARwsKWCQzAwMLClgMhCMDCwpYCDhDAwsI=
====catalogjs annotation end====*/