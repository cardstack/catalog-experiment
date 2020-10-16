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


export { keys as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvODQuanMBwsCVwq0uL2Rpc3QvMTMyLmpzBcLAlcKwLi9pc0FycmF5TGlrZS5qcwnCwIGnZGVmYXVsdJShbKRrZXlzEMCRkxDAwIStYXJyYXlMaWtlS2V5c5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCoYmFzZUtleXOboWmQwgbAkgcIwAHAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6FpkMIKwJILDMACwKdkZWZhdWx0kKRrZXlzm6Fsk6tpc0FycmF5TGlrZa1hcnJheUxpa2VLZXlzqGJhc2VLZXlzwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCw3AwMLClgsNwAjCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYLCMDAwsKWARsKDcLClgkAC8DCwpYLC8DAwsKWFAvABMLCls0CegsOEMLClgkEwAzCwpYJBMDAwsKWAw4PwMLC
====catalogjs annotation end====*/