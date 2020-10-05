import { default as copyObject } from "./dist/54.js";
import { default as keysIn } from "./keysIn.js";



/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */

function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

const _default = (toPlainObject);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTQuanMBk8KrLi9rZXlzSW4uanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSqY29weU9iamVjdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCma2V5c0lum6FpkMIGwJIHCMABwKdkZWZhdWx0kK10b1BsYWluT2JqZWN0m6Fskqpjb3B5T2JqZWN0pmtleXNJbsIJwJIKC8DAwMCQqF9kZWZhdWx0m6Fska10b1BsYWluT2JqZWN0wg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClhMKwAjCwpYBFgYJwsKWCQAHwMLClgsGwMDCwpYIBsDAwsKWzQIxCwoMwsKWCQ3ABMLClgQNwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/