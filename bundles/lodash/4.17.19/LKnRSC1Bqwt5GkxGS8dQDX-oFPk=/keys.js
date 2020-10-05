import { default as arrayLikeKeys } from "./dist/84.js";
import { default as baseKeys } from "./dist/132.js";
import { default as isArrayLike } from "./isArrayLike.js";




/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

const _default = (keys);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvODQuanMBk8KtLi9kaXN0LzEzMi5qcwWTwrAuL2lzQXJyYXlMaWtlLmpzCYGnZGVmYXVsdJShbKhfZGVmYXVsdBTAkZMUwMKFrWFycmF5TGlrZUtleXOboWmQwgLAkgMEwADAp2RlZmF1bHSQqGJhc2VLZXlzm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtpc0FycmF5TGlrZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCka2V5c5uhbJOraXNBcnJheUxpa2WtYXJyYXlMaWtlS2V5c6hiYXNlS2V5c8INwJIOD8DAwMCQqF9kZWZhdWx0m6FskaRrZXlzwhHAkhITwMDAwJDcABWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClgsNwAjCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYLCMDAwsKWARsKDcLClgkAC8DCwpYLC8DAwsKWFAvABMLCls0CegsOEMLClgkEwAzCwpYEBMDAwsKWAgERFMLClgYBEsDCwpYACMAPwsKWCQjAwMLClgEOE8DCwg==
====catalogjs annotation end====*/