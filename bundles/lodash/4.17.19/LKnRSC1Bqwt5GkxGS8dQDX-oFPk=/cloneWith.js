import { default as baseClone } from "./dist/40.js";


/** Used to compose bitmasks for cloning. */

var CLONE_SYMBOLS_FLAG = 4;
/**
 * This method is like `_.clone` except that it accepts `customizer` which
 * is invoked to produce the cloned value. If `customizer` returns `undefined`,
 * cloning is handled by the method instead. The `customizer` is invoked with
 * up to four arguments; (value [, index|key, object, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeepWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * }
 *
 * var el = _.cloneWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 0
 */

function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
}

const _default = (cloneWith);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvNDAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSpYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kLJDTE9ORV9TWU1CT0xTX0ZMQUeboWyQwgbAkgcIwMDAwJCpY2xvbmVXaXRom6FskqliYXNlQ2xvbmWyQ0xPTkVfU1lNQk9MU19GTEFHwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRqWNsb25lV2l0aMINwJIOD8DAwMCQ3AARlgAAAcDCw5YAFwIFwsKWCQADwMLClgsJwMDCwpZoCcAIwsKWMQEGCcLClgQEB8DCwpYAEsDAwsKWCBLAwMLCls0DbRAKDMLClgkJwATCwpYECcDAwsKWAgENEMLClgYBDsDCwpYACMALwsKWCQjAwMLClgEOD8DCwg==
====catalogjs annotation end====*/