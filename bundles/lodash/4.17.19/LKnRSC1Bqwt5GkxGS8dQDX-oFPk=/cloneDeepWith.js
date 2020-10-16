import { default as baseClone } from "./dist/40.js";


/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;
/**
 * This method is like `_.cloneWith` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the deep cloned value.
 * @see _.cloneWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * }
 *
 * var el = _.cloneDeepWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 20
 */

function cloneDeepWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
}


export { cloneDeepWith as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvNDAuanMBwsCBp2RlZmF1bHSUoWytY2xvbmVEZWVwV2l0aA/AkZMPwMCEqWJhc2VDbG9uZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCvQ0xPTkVfREVFUF9GTEFHm6FskMIGwJIHCMDAwMCQskNMT05FX1NZTUJPTFNfRkxBR5uhbJDCCcCSCgvAwMDAkK1jbG9uZURlZXBXaXRom6Fsk6liYXNlQ2xvbmWvQ0xPTkVfREVFUF9GTEFHskNMT05FX1NZTUJPTFNfRkxBR8IMwJINDsDAwMCQ3AAQlgAAAcDCw5YAFwIFwsKWCQADwMLClgsJwMDCwpZoCcAIwsKWMQEGDMLClgQEBwnCwpYAD8DAwsKWCA/AC8LClgYECsDCwpYAEsDAwsKWAxLAwMLCls0CphAND8LClgkNwATCwpYJDcDAwsKWAw4OwMLC
====catalogjs annotation end====*/