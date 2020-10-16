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

export { flowRight as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMzYuanMBwsCBp2RlZmF1bHSUoWypZmxvd1JpZ2h0CsCRkwrAwIKqY3JlYXRlRmxvd5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCpZmxvd1JpZ2h0m6FskapjcmVhdGVGbG93wgYJkgcIwMDAwJGqY3JlYXRlRmxvd5uWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgAKwMDCwpbNAecBBgrCwpYEAAfAwsKWAAnACcLClgkJwMDCwpYDBgTAwsKWAg4IwMLC
====catalogjs annotation end====*/