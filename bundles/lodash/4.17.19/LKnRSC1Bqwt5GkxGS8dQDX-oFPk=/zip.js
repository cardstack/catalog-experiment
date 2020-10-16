import { default as baseRest } from "./dist/49.js";
import { default as unzip } from "./unzip.js";



/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 */

var zip = baseRest(unzip);

export { zip as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDkuanMBwsCVwqouL3VuemlwLmpzBcLAgadkZWZhdWx0lKFso3ppcA7AkZMOwMCDqGJhc2VSZXN0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKV1bnppcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCjemlwm6FskqhiYXNlUmVzdKV1bnppcMIKDZILDMDAwMCSqGJhc2VSZXN0pXVuemlwn5YAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWAAjACMLClgEVBgnCwpYJAAfAwsKWCwXAwMLClgEFwMDCwpbNAewBCg7CwpYEAAvAwsKWAAPADcLClgkDwMDCwpYDAQTAwsKWAg4MwMLC
====catalogjs annotation end====*/