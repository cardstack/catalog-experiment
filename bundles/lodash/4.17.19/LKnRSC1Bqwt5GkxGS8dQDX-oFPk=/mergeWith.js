import { default as baseMerge } from "./dist/53.js";
import { default as createAssigner } from "./dist/48.js";



/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */

var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

export { mergeWith as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNTMuanMBwsCVwqwuL2Rpc3QvNDguanMFwsCBp2RlZmF1bHSUoWypbWVyZ2VXaXRoDsCRkw7AwIOpYmFzZU1lcmdlm6FpkMICwJIDBMAAwKdkZWZhdWx0kK5jcmVhdGVBc3NpZ25lcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpbWVyZ2VXaXRom6Fskq5jcmVhdGVBc3NpZ25lcqliYXNlTWVyZ2XCCg2SCwzAwMDAkqliYXNlTWVyZ2WuY3JlYXRlQXNzaWduZXKflgAAAcDCw5YAFwIFwsKWCQADwMLClgsJwMDCwpY1CcDAwsKWARcGCcLClgkAB8DCwpYLDsDAwsKWAA7ABMLCls0D4wEKDsLClgQAC8DCwpYACcANwsKWCQnAwMLClgMqCMDCwpYCDgzAwsI=
====catalogjs annotation end====*/