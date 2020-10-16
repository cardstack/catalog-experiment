import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";








/** Used as references for the maximum length and index of an array. */

var MAX_ARRAY_LENGTH = 4294967295;
/**
 * Splits `string` by `separator`.
 *
 * **Note:** This method is based on
 * [`String#split`](https://mdn.io/String/split).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to split.
 * @param {RegExp|string} separator The separator pattern to split by.
 * @param {number} [limit] The length to truncate results to.
 * @returns {Array} Returns the string segments.
 * @example
 *
 * _.split('a-b-c', '-', 2);
 * // => ['a', 'b']
 */

function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }

  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;

  if (!limit) {
    return [];
  }

  string = toString(string);

  if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
    separator = baseToString(separator);

    if (!separator && hasUnicode(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }

  return string.split(separator, limit);
}


export { split as default };
/*====catalogjs annotation start====
lZeVwqwuL2Rpc3QvMjIuanMBwsCVwq0uL2Rpc3QvMTQwLmpzBcLAlcKtLi9kaXN0LzE0NS5qcwnCwJXCrC4vZGlzdC83MC5qcw3CwJXCrS4vaXNSZWdFeHAuanMRwsCVwq0uL2Rpc3QvMTQzLmpzFcLAlcKtLi90b1N0cmluZy5qcxnCwIGnZGVmYXVsdJShbKVzcGxpdCTAkZMkwMCJrGJhc2VUb1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCpY2FzdFNsaWNlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKpoYXNVbmljb2Rlm6FpkMIKwJILDMACwKdkZWZhdWx0kK5pc0l0ZXJhdGVlQ2FsbJuhaZDCDsCSDxDAA8CnZGVmYXVsdJCoaXNSZWdFeHCboWmQwhLAkhMUwATAp2RlZmF1bHSQrXN0cmluZ1RvQXJyYXmboWmQwhbAkhcYwAXAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIawJIbHMAGwKdkZWZhdWx0kLBNQVhfQVJSQVlfTEVOR1RIm6FskMIewJIfIMDAwMCQpXNwbGl0m6FsmK5pc0l0ZXJhdGVlQ2FsbLBNQVhfQVJSQVlfTEVOR1RIqHRvU3RyaW5nqGlzUmVnRXhwrGJhc2VUb1N0cmluZ6poYXNVbmljb2RlqWNhc3RTbGljZa1zdHJpbmdUb0FycmF5wiHAkiIjwMDAwJDcACWWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwzAwMLCliAMwAzCwpYBGAYJwsKWCQAHwMLClgsJwMDCwpYZCcAYwsKWARgKDcLClgkAC8DCwpYLCsDAwsKWJArACMLClgEXDhHCwpYJAA/AwsKWCw7AwMLClkgOwCDCwpYBGBIVwsKWCQATwMLClgsIwMDCwpZSCMAEwsKWARgWGcLClgkAF8DCwpYLDcDAwsKWAQ3AwMLClgEYGh3CwpYJABvAwsKWCwjAwMLClkAIwBTCwpZSAR4hwsKWBA0fwMLClgAQwMDCwpZmEMAcwsKWzQHySiIkwsKWCQXAEMLClgkFwMDCwpYDDiPAwsI=
====catalogjs annotation end====*/