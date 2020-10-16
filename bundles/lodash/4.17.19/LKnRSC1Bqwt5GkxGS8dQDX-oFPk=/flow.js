import { default as createFlow } from "./dist/36.js";


/**
 * Creates a function that returns the result of invoking the given functions
 * with the `this` binding of the created function, where each successive
 * invocation is supplied the return value of the previous.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flowRight
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flow([_.add, square]);
 * addSquare(1, 2);
 * // => 9
 */

var flow = createFlow();

export { flow as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMzYuanMBwsCBp2RlZmF1bHSUoWykZmxvdwrAkZMKwMCCqmNyZWF0ZUZsb3eboWmQwgLAkgMEwADAp2RlZmF1bHSQpGZsb3eboWyRqmNyZWF0ZUZsb3fCBgmSBwjAwMDAkapjcmVhdGVGbG93m5YAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWAArAwMLCls0CQQEGCsLClgQAB8DCwpYABMAJwsKWCQTAwMLClgMCBMDCwpYCDgjAwsI=
====catalogjs annotation end====*/