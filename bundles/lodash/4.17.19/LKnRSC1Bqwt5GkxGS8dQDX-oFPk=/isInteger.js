import { default as toInteger } from "./toInteger.js";


/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */

function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}

const _default = (isInteger);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq4uL3RvSW50ZWdlci5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQMwJGTDMDCg6l0b0ludGVnZXKboWmQwgLAkgMEwADAp2RlZmF1bHSQqWlzSW50ZWdlcpuhbJGpdG9JbnRlZ2VywgXAkgYHwMDAwJCoX2RlZmF1bHSboWyRqWlzSW50ZWdlcsIJwJIKC8DAwMCQnZYAAAHAwsOWABkCBcLClgkAA8DCwpYLCcDAwsKWOAnAwMLCls0B/QoGCMLClgkJwATCwpYECcDAwsKWAgEJDMLClgYBCsDCwpYACMAHwsKWCQjAwMLClgEOC8DCwg==
====catalogjs annotation end====*/