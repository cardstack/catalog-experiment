import { default as baseClone } from "./dist/40.js";


/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;
/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */

function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

const _default = (cloneDeep);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvNDAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0E8CRkxPAwoWpYmFzZUNsb25lm6FpkMICwJIDBMAAwKdkZWZhdWx0kK9DTE9ORV9ERUVQX0ZMQUeboWyQwgbAkgcIwMDAwJCyQ0xPTkVfU1lNQk9MU19GTEFHm6FskMIJwJIKC8DAwMCQqWNsb25lRGVlcJuhbJOpYmFzZUNsb25lr0NMT05FX0RFRVBfRkxBR7JDTE9ORV9TWU1CT0xTX0ZMQUfCDMCSDQ7AwMDAkKhfZGVmYXVsdJuhbJGpY2xvbmVEZWVwwhDAkhESwMDAwJDcABSWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwnAwMLClhMJwAjCwpYxAQYMwsKWBAQHCcLClgAPwMDCwpYID8ALwsKWBgQKwMLClgASwMDCwpYDEsDAwsKWzQGgBA0PwsKWCQnABMLClgQJwMDCwpYCARATwsKWBgERwMLClgAIwA7CwpYJCMDAwsKWAQ4SwMLC
====catalogjs annotation end====*/