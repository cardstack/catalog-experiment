import { default as createFlow } from "./dist/36.js";


/**
 * This method is like `_.flow` except that it creates a function that
 * invokes the given functions from right to left.
 *
 * @static
 * @since 3.0.0
 * @memberOf _
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flow
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flowRight([square, _.add]);
 * addSquare(1, 2);
 * // => 9
 */

var flowRight = createFlow(true);
const _default = (flowRight);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMzYuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOqY3JlYXRlRmxvd5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCpZmxvd1JpZ2h0m6FskapjcmVhdGVGbG93wgYJkgcIwMDAwJGqY3JlYXRlRmxvd6hfZGVmYXVsdJuhbJGpZmxvd1JpZ2h0wgvAkgwNwMDAwJCflgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYACsDAwsKWzQHnAQYKwsKWBAAHwMLClgAJwAnCwpYECcDAwsKWAwYEwMLClgEBCw7CwpYGAQzAwsKWAAjACMLClgkIwMDCwpYBDg3AwsI=
====catalogjs annotation end====*/