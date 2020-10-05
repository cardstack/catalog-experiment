import { default as createWrap } from "./dist/23.js";


/** Used to compose bitmasks for function metadata. */

var WRAP_CURRY_RIGHT_FLAG = 16;
/**
 * This method is like `_.curry` except that arguments are applied to `func`
 * in the manner of `_.partialRight` instead of `_.partial`.
 *
 * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curryRight(abc);
 *
 * curried(3)(2)(1);
 * // => [1, 2, 3]
 *
 * curried(2, 3)(1);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(3)(1, _)(2);
 * // => [1, 2, 3]
 */

function curryRight(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curryRight.placeholder;
  return result;
} // Assign default placeholders.


curryRight.placeholder = {};
const _default = (curryRight);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSqY3JlYXRlV3JhcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJC1V1JBUF9DVVJSWV9SSUdIVF9GTEFHm6FskMIGwJIHCMDAwMCQqmN1cnJ5UmlnaHSboWyTqmNyZWF0ZVdyYXC1V1JBUF9DVVJSWV9SSUdIVF9GTEFHqmN1cnJ5UmlnaHTDCcCUCgsMDcDAwMCQqF9kZWZhdWx0m6FskapjdXJyeVJpZ2h0wg/AkhARwMDAwJDcABOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClksKwAjCwpY7AQYJwsKWBAUHwMLClgAVwMDCwpYHFcALwsKWzQP2IAoMwsKWCQrABMLCllgKwMDCwpYjCsAOwsKWBArAwMLClhMBDxLCwpYGARDAwsKWAAjADcLClgkIwMDCwpYBDhHAwsI=
====catalogjs annotation end====*/