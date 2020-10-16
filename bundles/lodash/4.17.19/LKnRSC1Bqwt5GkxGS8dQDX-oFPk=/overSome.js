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

export { overSome as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTUxLmpzAcLAlcKrLi9kaXN0LzUuanMFwsCBp2RlZmF1bHSUoWyob3ZlclNvbWUOwJGTDsDAg6lhcnJheVNvbWWboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNyZWF0ZU92ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQqG92ZXJTb21lm6FskqpjcmVhdGVPdmVyqWFycmF5U29tZcIKDZILDMDAwMCSqWFycmF5U29tZapjcmVhdGVPdmVyn5YAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWAQnAwMLClgEWBgnCwpYJAAfAwsKWCwrAwMLClgAKwATCwpbNAfUBCg7CwpYEAAvAwsKWAAjADcLClgkIwMDCwpYDAQjAwsKWAg4MwMLC
====catalogjs annotation end====*/