import { default as createWrap } from "./dist/23.js";


/** Used to compose bitmasks for function metadata. */

var WRAP_CURRY_FLAG = 8;
/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
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
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */

function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
} // Assign default placeholders.


curry.placeholder = {};
const _default = (curry);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSqY3JlYXRlV3JhcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCvV1JBUF9DVVJSWV9GTEFHm6FskMIGwJIHCMDAwMCQpWN1cnJ5m6Fsk6pjcmVhdGVXcmFwr1dSQVBfQ1VSUllfRkxBR6VjdXJyecMJwJQKCwwNwMDAwJCoX2RlZmF1bHSboWyRpWN1cnJ5wg/AkhARwMDAwJDcABOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClksKwAjCwpY7AQYJwsKWBAQHwMLClgAPwMDCwpYHD8ALwsKWzQSoIAoMwsKWCQXABMLCllgFwMDCwpYjBcAOwsKWBAXAwMLClhMBDxLCwpYGARDAwsKWAAjADcLClgkIwMDCwpYBDhHAwsI=
====catalogjs annotation end====*/