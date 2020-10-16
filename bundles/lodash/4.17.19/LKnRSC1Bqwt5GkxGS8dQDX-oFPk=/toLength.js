import { default as baseClamp } from "./dist/148.js";
import { default as toInteger } from "./toInteger.js";



/** Used as references for the maximum length and index of an array. */

var MAX_ARRAY_LENGTH = 4294967295;
/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3.2);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3.2');
 * // => 3
 */

function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
}


export { toLength as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTQ4LmpzAcLAlcKuLi90b0ludGVnZXIuanMFwsCBp2RlZmF1bHSUoWyodG9MZW5ndGgQwJGTEMDAhKliYXNlQ2xhbXCboWmQwgLAkgMEwADAp2RlZmF1bHSQqXRvSW50ZWdlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCwTUFYX0FSUkFZX0xFTkdUSJuhbJDCCsCSCwzAwMDAkKh0b0xlbmd0aJuhbJOpYmFzZUNsYW1wqXRvSW50ZWdlcrBNQVhfQVJSQVlfTEVOR1RIwg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClhsJwAjCwpYBGQYJwsKWCQAHwMLClgsJwMDCwpYBCcAMwsKWTQEKDcLClgQNC8DCwpYAEMDAwsKWDBDAwMLCls0CKAgOEMLClgkIwATCwpYJCMDAwsKWAw4PwMLC
====catalogjs annotation end====*/