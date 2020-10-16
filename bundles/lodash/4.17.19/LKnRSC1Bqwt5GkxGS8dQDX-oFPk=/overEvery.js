import { default as arrayEvery } from "./dist/163.js";
import { default as createOver } from "./dist/5.js";



/**
 * Creates a function that checks if **all** of the `predicates` return
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
 * var func = _.overEvery([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => false
 *
 * func(NaN);
 * // => false
 */

var overEvery = createOver(arrayEvery);

export { overEvery as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTYzLmpzAcLAlcKrLi9kaXN0LzUuanMFwsCBp2RlZmF1bHSUoWypb3ZlckV2ZXJ5DsCRkw7AwIOqYXJyYXlFdmVyeZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY3JlYXRlT3ZlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpb3ZlckV2ZXJ5m6FskqpjcmVhdGVPdmVyqmFycmF5RXZlcnnCCg2SCwzAwMDAkqphcnJheUV2ZXJ5qmNyZWF0ZU92ZXKflgAAAcDCw5YAGAIFwsKWCQADwMLClgsKwMDCwpYBCsDAwsKWARYGCcLClgkAB8DCwpYLCsDAwsKWAArABMLCls0B9wEKDsLClgQAC8DCwpYACcANwsKWCQnAwMLClgMBCMDCwpYCDgzAwsI=
====catalogjs annotation end====*/