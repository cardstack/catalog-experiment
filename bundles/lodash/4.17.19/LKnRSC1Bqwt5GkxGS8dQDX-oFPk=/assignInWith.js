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
const _default = (assignInWith);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvNTQuanMBk8KsLi9kaXN0LzQ4LmpzBZPCqy4va2V5c0luLmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBbAkZMWwMKFqmNvcHlPYmplY3SboWmQwgLAkgMEwADAp2RlZmF1bHSQrmNyZWF0ZUFzc2lnbmVym6FpkMIGwJIHCMABwKdkZWZhdWx0kKZrZXlzSW6boWmQwgrAkgsMwALAp2RlZmF1bHSQrGFzc2lnbkluV2l0aJuhbJOuY3JlYXRlQXNzaWduZXKqY29weU9iamVjdKZrZXlzSW7CDhGSDxDAwMDAk6pjb3B5T2JqZWN0rmNyZWF0ZUFzc2lnbmVypmtleXNJbqhfZGVmYXVsdJuhbJGsYXNzaWduSW5XaXRowhPAkhQVwMDAwJDcABeWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLCljUKwAzCwpYBFwYJwsKWCQAHwMLClgsOwMDCwpYADsAEwsKWARYKDcLClgkAC8DCwpYLBsDAwsKWCQbAwMLCls0DvAEOEsLClgQAD8DCwpYADMARwsKWBAzAwMLClgMhCMDCwpYBARMWwsKWBgEUwMLClgAIwBDCwpYJCMDAwsKWAQ4VwMLC
====catalogjs annotation end====*/