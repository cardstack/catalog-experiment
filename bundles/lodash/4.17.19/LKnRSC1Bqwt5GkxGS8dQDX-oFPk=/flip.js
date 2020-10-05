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

const _default = (flip);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSqY3JlYXRlV3JhcJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCuV1JBUF9GTElQX0ZMQUeboWyQwgbAkgcIwMDAwJCkZmxpcJuhbJKqY3JlYXRlV3JhcK5XUkFQX0ZMSVBfRkxBR8IJwJIKC8DAwMCQqF9kZWZhdWx0m6FskaRmbGlwwg3Akg4PwMDAwJDcABGWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClhIKwAjCwpY7AQYJwsKWBAYHwMLClgAOwMDCwpYHDsDAwsKWzQGlBAoMwsKWCQTABMLClgQEwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/