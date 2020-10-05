import { default as arraySome } from "./dist/151.js";
import { default as createOver } from "./dist/5.js";



/**
 * Creates a function that checks if **any** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Function|Function[])} [predicates=[_.identity]]
 *  The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overSome([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => true
 *
 * func(NaN);
 * // => false
 */

var overSome = createOver(arraySome);
const _default = (overSome);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTUxLmpzAZPCqy4vZGlzdC81LmpzBYGnZGVmYXVsdJShbKhfZGVmYXVsdBLAkZMSwMKEqWFycmF5U29tZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY3JlYXRlT3ZlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCob3ZlclNvbWWboWySqmNyZWF0ZU92ZXKpYXJyYXlTb21lwgoNkgsMwMDAwJKpYXJyYXlTb21lqmNyZWF0ZU92ZXKoX2RlZmF1bHSboWyRqG92ZXJTb21lwg/AkhARwMDAwJDcABOWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClgEJwMDCwpYBFgYJwsKWCQAHwMLClgsKwMDCwpYACsAEwsKWzQH1AQoOwsKWBAALwMLClgAIwA3CwpYECMDAwsKWAwEIwMLClgEBDxLCwpYGARDAwsKWAAjADMLClgkIwMDCwpYBDhHAwsI=
====catalogjs annotation end====*/