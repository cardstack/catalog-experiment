import { default as isObject } from "./isObject.js";
import { default as isSymbol } from "./isSymbol.js";



/** Used as references for various `Number` constants. */

var NAN = 0 / 0;
/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */

function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}


export { toNumber as default };
/*====catalogjs annotation start====
lZKVwq0uL2lzT2JqZWN0LmpzAcLAlcKtLi9pc1N5bWJvbC5qcwbCwIGnZGVmYXVsdJShbKh0b051bWJlcivAkZMrwMCJqGlzT2JqZWN0m6FpkMICwJMDBAXAAMCnZGVmYXVsdJCoaXNTeW1ib2yboWmQwgfAkggJwAHAp2RlZmF1bHSQo05BTpuhbJDCCw+TDA0OwMDAwJCmcmVUcmltm6FskMIRFJISE8DAwMCQqnJlSXNCYWRIZXiboWyQwhYZkhcYwMDAwJCqcmVJc0JpbmFyeZuhbJDCGx6SHB3AwMDAkKlyZUlzT2N0YWyboWyQwiAjkiEiwMDAwJCsZnJlZVBhcnNlSW50m6FskahwYXJzZUludMIlwJImJ8DAwMCQqHRvTnVtYmVym6FsmKhpc1N5bWJvbKNOQU6oaXNPYmplY3SmcmVUcmltqnJlSXNCaW5hcnmpcmVJc09jdGFsrGZyZWVQYXJzZUludKpyZUlzQmFkSGV4wijAkikqwMDAwJDcACyWAAABwMLDlgAYAgbCwpYJAAPAwsKWCwjAwMLClg0IwAXCwpZlCMATwsKWARgHCsLClgkACMDCwpYLCMDAwsKWSQjADcLClj8BCxDCwpYEAAzAwsKWAAPAD8LClhYDwATCwpYPA8DAwsKWAwXAwMLCljgBERXCwpYEABLAwsKWAAbAFMLClsyLBsAdwsKWAwzAwMLClj4BFhrCwpYEABfAwsKWAArAGcLCliUKwA7CwpYDFMDAwsKWLgEbH8LClgQAHMDCwpYACsAewsKWGArAIsLClgMMwMDCwpYtASAkwsKWBAAhwMLClgAJwCPCwpYjCcAnwsKWAw3AwMLClkQBJSjCwpYECybAwsKWAAzAwMLClg8MwBjCwpbNAXUMKSvCwpYJCMAJwsKWCQjAwMLClgMOKsDCwg==
====catalogjs annotation end====*/