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
const _default = (flow);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMzYuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOqY3JlYXRlRmxvd5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCkZmxvd5uhbJGqY3JlYXRlRmxvd8IGCZIHCMDAwMCRqmNyZWF0ZUZsb3eoX2RlZmF1bHSboWyRpGZsb3fCC8CSDA3AwMDAkJ+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgAKwMDCwpbNAkEBBgrCwpYEAAfAwsKWAATACcLClgQEwMDCwpYDAgTAwsKWAQELDsLClgYBDMDCwpYACMAIwsKWCQjAwMLClgEODcDCwg==
====catalogjs annotation end====*/