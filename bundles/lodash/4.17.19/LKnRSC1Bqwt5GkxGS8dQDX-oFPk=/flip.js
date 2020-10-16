import { default as createWrap } from "./dist/23.js";


/** Used to compose bitmasks for function metadata. */

var WRAP_FLIP_FLAG = 512;
/**
 * Creates a function that invokes `func` with arguments reversed.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to flip arguments for.
 * @returns {Function} Returns the new flipped function.
 * @example
 *
 * var flipped = _.flip(function() {
 *   return _.toArray(arguments);
 * });
 *
 * flipped('a', 'b', 'c', 'd');
 * // => ['d', 'c', 'b', 'a']
 */

function flip(func) {
  return createWrap(func, WRAP_FLIP_FLAG);
}


export { flip as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjMuanMBwsCBp2RlZmF1bHSUoWykZmxpcAzAkZMMwMCDqmNyZWF0ZVdyYXCboWmQwgLAkgMEwADAp2RlZmF1bHSQrldSQVBfRkxJUF9GTEFHm6FskMIGwJIHCMDAwMCQpGZsaXCboWySqmNyZWF0ZVdyYXCuV1JBUF9GTElQX0ZMQUfCCcCSCgvAwMDAkJ2WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClhIKwAjCwpY7AQYJwsKWBAYHwMLClgAOwMDCwpYHDsDAwsKWzQGlBAoMwsKWCQTABMLClgkEwMDCwpYDDgvAwsI=
====catalogjs annotation end====*/