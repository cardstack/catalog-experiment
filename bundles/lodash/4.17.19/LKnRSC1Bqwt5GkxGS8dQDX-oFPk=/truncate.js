import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isObject } from "./isObject.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringSize } from "./dist/144.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";










/** Used as default options for `_.truncate`. */

var DEFAULT_TRUNC_LENGTH = 30,
    DEFAULT_TRUNC_OMISSION = '...';
/** Used to match `RegExp` flags from their coerced string values. */

var reFlags = /\w*$/;
/**
 * Truncates `string` if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with the omission
 * string which defaults to "...".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to truncate.
 * @param {Object} [options={}] The options object.
 * @param {number} [options.length=30] The maximum string length.
 * @param {string} [options.omission='...'] The string to indicate text is omitted.
 * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
 * @returns {string} Returns the truncated string.
 * @example
 *
 * _.truncate('hi-diddly-ho there, neighborino');
 * // => 'hi-diddly-ho there, neighbo...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'length': 24,
 *   'separator': ' '
 * });
 * // => 'hi-diddly-ho there,...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'length': 24,
 *   'separator': /,? +/
 * });
 * // => 'hi-diddly-ho there...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'omission': ' [...]'
 * });
 * // => 'hi-diddly-ho there, neig [...]'
 */

function truncate(string, options) {
  var length = DEFAULT_TRUNC_LENGTH,
      omission = DEFAULT_TRUNC_OMISSION;

  if (isObject(options)) {
    var separator = 'separator' in options ? options.separator : separator;
    length = 'length' in options ? toInteger(options.length) : length;
    omission = 'omission' in options ? baseToString(options.omission) : omission;
  }

  string = toString(string);
  var strLength = string.length;

  if (hasUnicode(string)) {
    var strSymbols = stringToArray(string);
    strLength = strSymbols.length;
  }

  if (length >= strLength) {
    return string;
  }

  var end = length - stringSize(omission);

  if (end < 1) {
    return omission;
  }

  var result = strSymbols ? castSlice(strSymbols, 0, end).join('') : string.slice(0, end);

  if (separator === undefined) {
    return result + omission;
  }

  if (strSymbols) {
    end += result.length - end;
  }

  if (isRegExp(separator)) {
    if (string.slice(end).search(separator)) {
      var match,
          substring = result;

      if (!separator.global) {
        separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
      }

      separator.lastIndex = 0;

      while (match = separator.exec(substring)) {
        var newEnd = match.index;
      }

      result = result.slice(0, newEnd === undefined ? end : newEnd);
    }
  } else if (string.indexOf(baseToString(separator), end) != end) {
    var index = result.lastIndexOf(separator);

    if (index > -1) {
      result = result.slice(0, index);
    }
  }

  return result + omission;
}


export { truncate as default };
/*====catalogjs annotation start====
lZmVwqwuL2Rpc3QvMjIuanMBwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzE0NS5qcwrCwJXCrS4vaXNPYmplY3QuanMOwsCVwq0uL2lzUmVnRXhwLmpzEsLAlcKtLi9kaXN0LzE0NC5qcxbCwJXCrS4vZGlzdC8xNDMuanMawsCVwq4uL3RvSW50ZWdlci5qcx7CwJXCrS4vdG9TdHJpbmcuanMiwsCBp2RlZmF1bHSUoWyodHJ1bmNhdGU2wJGTNsDAjaxiYXNlVG9TdHJpbmeboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKljYXN0U2xpY2WboWmQwgfAkggJwAHAp2RlZmF1bHSQqmhhc1VuaWNvZGWboWmQwgvAkgwNwALAp2RlZmF1bHSQqGlzT2JqZWN0m6FpkMIPwJIQEcADwKdkZWZhdWx0kKhpc1JlZ0V4cJuhaZDCE8CSFBXABMCnZGVmYXVsdJCqc3RyaW5nU2l6ZZuhaZDCF8CSGBnABcCnZGVmYXVsdJCtc3RyaW5nVG9BcnJheZuhaZDCG8CSHB3ABsCnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMIfwJIgIcAHwKdkZWZhdWx0kKh0b1N0cmluZ5uhaZDCI8CTJCUmwAjAp2RlZmF1bHSQtERFRkFVTFRfVFJVTkNfTEVOR1RIm6FskMIowJIpKsDAwMCQtkRFRkFVTFRfVFJVTkNfT01JU1NJT06boWyQwivAkiwtwMDAwJCncmVGbGFnc5uhbJDCLzKSMDHAwMDAkKh0cnVuY2F0ZZuhbJy0REVGQVVMVF9UUlVOQ19MRU5HVEi2REVGQVVMVF9UUlVOQ19PTUlTU0lPTqhpc09iamVjdKl0b0ludGVnZXKsYmFzZVRvU3RyaW5nqHRvU3RyaW5nqmhhc1VuaWNvZGWtc3RyaW5nVG9BcnJheapzdHJpbmdTaXplqWNhc3RTbGljZahpc1JlZ0V4cKdyZUZsYWdzwjPAkjQ1wMDAwJDcADeWAAABwMLDlgAXAgbCwpYJAAPAwsKWCwzAwMLClkIMwCXCwpbNAQcMwMDCwpYBGAcKwsKWCQAIwMLClgsJwMDCwpZUCcAVwsKWARgLDsLClgkADMDCwpYLCsDAwsKWMgrAHcLClgEYDxLCwpYJABDAwsKWCwjAwMLClgkIwCHCwpYBGBMWwsKWCQAUwMLClgsIwMDCwpbMugjAJsLClgEYFxrCwpYJABjAwsKWCwrAwMLClnwKwAnCwpYBGBsewsKWCQAcwMLClgsNwMDCwpYhDcAZwsKWARkfIsLClgkAIMDCwpYLCcDAwsKWfAnABMLClgEYIyfCwpYJACTAwsKWCwjAwMLCli8IwA3CwpbMugjAMcLClj0BKC7CwpYEBSkrwsKWABTAwMLCliMUwC3CwpYGCCzAwsKWABbAwMLClhMWwBHCwpZIAS8zwsKWBAAwwMLClgAHwDLCwpYBB8AFwsKWAwbAwMLCls0EjcyxNDbCwpYJCMAqwsKWCQjAwMLClgMONcDCwg==
====catalogjs annotation end====*/