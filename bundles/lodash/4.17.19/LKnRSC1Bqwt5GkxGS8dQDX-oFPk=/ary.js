import { default as createWrap } from "./dist/23.js";


/** Used to compose bitmasks for function metadata. */

var WRAP_ARY_FLAG = 128;
/**
 * Creates a function that invokes `func`, with up to `n` arguments,
 * ignoring any additional arguments.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @param {number} [n=func.length] The arity cap.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.ary(parseInt, 1));
 * // => [6, 8, 10]
 */

function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = func && n == null ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
}


export { ary as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjMuanMBwsCBp2RlZmF1bHSUoWyjYXJ5DMCRkwzAwIOqY3JlYXRlV3JhcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtV1JBUF9BUllfRkxBR5uhbJDCBsCSBwjAwMDAkKNhcnmboWySqmNyZWF0ZVdyYXCtV1JBUF9BUllfRkxBR8IJwJIKC8DAwMCQnZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWZArACMLCljsBBgnCwpYEBgfAwsKWAA3AwMLClgcNwMDCwpbNAgMzCgzCwpYJA8AEwsKWCQPAwMLClgMOC8DCwg==
====catalogjs annotation end====*/