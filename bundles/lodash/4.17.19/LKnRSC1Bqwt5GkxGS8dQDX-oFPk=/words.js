import { default as toString } from "./toString.js";

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */

function asciiWords0(string) {
  return string.match(reAsciiWord) || [];
}

const asciiWords = (asciiWords0);

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */

function hasUnicodeWord0(string) {
  return reHasUnicodeWord.test(string);
}

const hasUnicodeWord = (hasUnicodeWord0);

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
/** Used to compose unicode capture groups. */

var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';
/** Used to compose unicode regexes. */

var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;
/** Used to match complex or compound words. */

var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')', rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower, rsUpper + '+' + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji].join('|'), 'g');
/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */

function unicodeWords0(string) {
  return string.match(reUnicodeWord) || [];
}

const unicodeWords = (unicodeWords0);





/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */

function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }

  return string.match(pattern) || [];
}

const _default = (words);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL3RvU3RyaW5nLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdMzRwJGTzNHAwt4AM6h0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCrcmVBc2NpaVdvcmSboWyQwgYJkgcIwMDAwJCrYXNjaWlXb3JkczCboWyRq3JlQXNjaWlXb3JkwgrAkgsMwMDAwJCqYXNjaWlXb3Jkc5uhbJGrYXNjaWlXb3JkczDCDsCSDxDAwMDAkLByZUhhc1VuaWNvZGVXb3Jkm6FskMISFZITFMDAwMCQr2hhc1VuaWNvZGVXb3JkMJuhbJGwcmVIYXNVbmljb2RlV29yZMIWwJIXGMDAwMCQrmhhc1VuaWNvZGVXb3Jkm6Fska9oYXNVbmljb2RlV29yZDDCGsCSGxzAwMDAkK1yc0FzdHJhbFJhbmdlm6FskMIewJMfICHAwMDAkLFyc0NvbWJvTWFya3NSYW5nZZuhbJDCIsCSIyTAwMDAkLVyZUNvbWJvSGFsZk1hcmtzUmFuZ2WboWyQwiXAkiYnwMDAwJCzcnNDb21ib1N5bWJvbHNSYW5nZZuhbJDCKMCSKSrAwMDAkKxyc0NvbWJvUmFuZ2WboWyTsXJzQ29tYm9NYXJrc1JhbmdltXJlQ29tYm9IYWxmTWFya3NSYW5nZbNyc0NvbWJvU3ltYm9sc1JhbmdlwisukiwtwMDAwJOxcnNDb21ib01hcmtzUmFuZ2W1cmVDb21ib0hhbGZNYXJrc1Jhbmdls3JzQ29tYm9TeW1ib2xzUmFuZ2WucnNEaW5nYmF0UmFuZ2WboWyQwi/AkzAxMsDAwMCQrHJzTG93ZXJSYW5nZZuhbJDCM8CTNDU2wMDAwJCtcnNNYXRoT3BSYW5nZZuhbJDCN8CSODnAwMDAkK5yc05vbkNoYXJSYW5nZZuhbJDCOsCSOzzAwMDAkLJyc1B1bmN0dWF0aW9uUmFuZ2WboWyQwj3Akj4/wMDAwJCscnNTcGFjZVJhbmdlm6FskMJAwJJBQsDAwMCQrHJzVXBwZXJSYW5nZZuhbJDCQ8CTREVGwMDAwJCqcnNWYXJSYW5nZZuhbJDCR8CSSEnAwMDAkKxyc0JyZWFrUmFuZ2WboWyUrXJzTWF0aE9wUmFuZ2WucnNOb25DaGFyUmFuZ2WycnNQdW5jdHVhdGlvblJhbmdlrHJzU3BhY2VSYW5nZcJKTpNLTE3AwMDAlK1yc01hdGhPcFJhbmdlrnJzTm9uQ2hhclJhbmdlsnJzUHVuY3R1YXRpb25SYW5nZaxyc1NwYWNlUmFuZ2WmcnNBcG9zm6FskMJQwJNRUlPAwMDAkKdyc0JyZWFrm6Fskaxyc0JyZWFrUmFuZ2XCVFiTVVZXwMDAwJGscnNCcmVha1Jhbmdlp3JzQ29tYm+boWyRrHJzQ29tYm9SYW5nZcJZXJJaW8DAwMCRrHJzQ29tYm9SYW5nZahyc0RpZ2l0c5uhbJDCXcCTXl9gwMDAwJCpcnNEaW5nYmF0m6Fska5yc0RpbmdiYXRSYW5nZcJhZJJiY8DAwMCRrnJzRGluZ2JhdFJhbmdlp3JzTG93ZXKboWyRrHJzTG93ZXJSYW5nZcJlaZNmZ2jAwMDAkaxyc0xvd2VyUmFuZ2WmcnNNaXNjm6Fslq1yc0FzdHJhbFJhbmdlrHJzQnJlYWtSYW5nZahyc0RpZ2l0c65yc0RpbmdiYXRSYW5nZaxyc0xvd2VyUmFuZ2WscnNVcHBlclJhbmdlwmpuk2tsbcDAwMCWrXJzQXN0cmFsUmFuZ2WucnNEaW5nYmF0UmFuZ2WscnNMb3dlclJhbmdlrHJzVXBwZXJSYW5nZaxyc0JyZWFrUmFuZ2WocnNEaWdpdHOmcnNGaXR6m6FskMJvwJJwccDAwMCQqnJzTW9kaWZpZXKboWySp3JzQ29tYm+mcnNGaXR6wnJ1knN0wMDAwJKncnNDb21ib6Zyc0ZpdHqrcnNOb25Bc3RyYWyboWyRrXJzQXN0cmFsUmFuZ2XCdnmSd3jAwMDAka1yc0FzdHJhbFJhbmdlqnJzUmVnaW9uYWyboWyQwnrAk3t8fcDAwMCQqnJzU3VyclBhaXKboWyQwn7Ak3/MgMyBwMDAwJCncnNVcHBlcpuhbJGscnNVcHBlclJhbmdlwsyCzIqXzIPMhMyFzIbMh8yIzInAwMDAkaxyc1VwcGVyUmFuZ2WlcnNaV0qboWyQwsyLwJLMjMyNwMDAwJCrcnNNaXNjTG93ZXKboWySp3JzTG93ZXKmcnNNaXNjwsyPzJOTzJDMkcySwMDAwJKncnNMb3dlcqZyc01pc2OrcnNNaXNjVXBwZXKboWySp3JzVXBwZXKmcnNNaXNjwsyUzJeSzJXMlsDAwMCSpnJzTWlzY6dyc1VwcGVyr3JzT3B0Q29udHJMb3dlcpuhbJGmcnNBcG9zwsyYzJyTzJnMmsybwMDAwJGmcnNBcG9zr3JzT3B0Q29udHJVcHBlcpuhbJGmcnNBcG9zwsydzKGTzJ7Mn8ygwMDAwJGmcnNBcG9zqHJlT3B0TW9km6Fskapyc01vZGlmaWVywsyizKaTzKPMpMylwMDAwJGqcnNNb2RpZmllcqhyc09wdFZhcpuhbJGqcnNWYXJSYW5nZcLMp8yrk8yozKnMqsDAwMCRqnJzVmFyUmFuZ2WpcnNPcHRKb2lum6FslqVyc1pXSqtyc05vbkFzdHJhbKpyc1JlZ2lvbmFsqnJzU3VyclBhaXKocnNPcHRWYXKocmVPcHRNb2TCzKzMr5LMrcyuwMDAwJarcnNOb25Bc3RyYWyqcnNSZWdpb25hbKpyc1N1cnJQYWlypXJzWldKqHJlT3B0TW9kqHJzT3B0VmFyqnJzT3JkTG93ZXKboWyQwsywwJLMscyywMDAwJCqcnNPcmRVcHBlcpuhbJDCzLPAksy0zLXAwMDAkKVyc1NlcZuhbJOocnNPcHRWYXKocmVPcHRNb2SpcnNPcHRKb2luwsy2zLmSzLfMuMDAwMCTqHJlT3B0TW9kqHJzT3B0VmFyqXJzT3B0Sm9pbqdyc0Vtb2ppm6FslKlyc0RpbmdiYXSqcnNSZWdpb25hbKpyc1N1cnJQYWlypXJzU2Vxwsy6zL2SzLvMvMDAwMCUqXJzRGluZ2JhdKpyc1JlZ2lvbmFsqnJzU3VyclBhaXKlcnNTZXGtcmVVbmljb2RlV29yZJuhbJymUmVnRXhwp3JzVXBwZXKncnNMb3dlcq9yc09wdENvbnRyTG93ZXKncnNCcmVha6tyc01pc2NVcHBlcq9yc09wdENvbnRyVXBwZXKrcnNNaXNjTG93ZXKqcnNPcmRVcHBlcqpyc09yZExvd2VyqHJzRGlnaXRzp3JzRW1vamnCzL/MwpLMwMzBwMDAwJuncnNCcmVha6hyc0RpZ2l0c6dyc0xvd2Vyp3JzVXBwZXKrcnNNaXNjTG93ZXKrcnNNaXNjVXBwZXKvcnNPcHRDb250ckxvd2Vyr3JzT3B0Q29udHJVcHBlcqpyc09yZExvd2VyqnJzT3JkVXBwZXKncnNFbW9qaa11bmljb2RlV29yZHMwm6Fska1yZVVuaWNvZGVXb3JkwszDwJLMxMzFwMDAwJCsdW5pY29kZVdvcmRzm6Fska11bmljb2RlV29yZHMwwszHwJLMyMzJwMDAwJCld29yZHOboWyUqHRvU3RyaW5nrmhhc1VuaWNvZGVXb3JkrHVuaWNvZGVXb3Jkc6phc2NpaVdvcmRzwszKwJLMy8zMwMDAwJCoX2RlZmF1bHSboWyRpXdvcmRzwszOwJLMz8zQwMDAwJDcANKWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLCliYIwBzCwpZCAQYKwsKWBAAHwMLClgALwAnCwpYhC8DAwsKWAyvAwMLClsyuCgsNwsKWCQvACMLClgQLwMDCwpYCAQ4RwsKWBgEPwMLClgAKwAzCwpYLCsDAwsKWTwESFsLClgQAE8DCwpYAEMAVwsKWFBDAwMLClgNEwMDCwpbM1BAXGcLClgkPwBTCwpYED8DAwsKWAgEaHcLClgYBG8DCwpYADsAYwsKWXg7AzMnCwpY0AR5PwsKWBBQfIsLClgANwMDCwpYHDcBNwsKWBw3AwMLClgYUIyXCwpYAEcDAwsKWABHAJ8LClgYUJijCwpYAFcDAwsKWAxXAKsLClgYUKSvCwpYAE8DAwsKWAxPAwMLClgYALC/CwpYADMAuwsKWBgzAwMLClgMAJMDCwpYGFDAzwsKWAA7AwMLClgYOwMDCwpYDDsA2wsKWBh40N8LClgAMwMDCwpYGDMDAwsKWAwzARcLClgYZODrCwpYADcDAwsKWAA3APMLClgYxOz3CwpYADsDAwsKWAw7AP8LClgYUPkDCwpYAEsDAwsKWAxLAQsLClgbMoUFDwsKWAAzAwMLClgMMwMDCwpYGHkRHwsKWAAzAwMLClgMMwMDCwpYGDMDAwsKWBhNISsLClgAKwMDCwpYGCsDAwsKWBgBLwMLClgAMwE7CwpYGDMDAwsKWAwzAX8LClgMAOcDCwpYxAVDMjsLClgQOUVTCwpYABsDAwsKWCAbAwMLClggGwMDCwpYGAFVZwsKWAAfAWMLClgwHwMyGwsKWDAfAzIfCwpYDBkzAwsKWBgBaXcLClgAHwFzCwpYIB8BxwsKWAwYtwMLClgYJXmHCwpYACMDAwsKWAwjAMsLClgIIwMy8wsKWBgBiZcLClgAJwGTCwpYJCcB9wsKWAwYxwMLClgYAZmrCwpYAB8BpwsKWCAfAbMLClgkHwMyawsKWAwY1wMLClgYAa2/CwpYABsBuwsKWCQbAwMLClgkGwMDCwpYDBiDAwsKWBh1wcsLClgAGwMDCwpYJBsDAwsKWBgBzdsLClgAKwHXCwpYACsDAwsKWAwZbwMLClgYAd3rCwpYAC8B5wsKWDAvAfMLClgMGIcDCwpYGJHt+wsKWAArAwMLClgIKwMyAwsKWAgrAzIHCwpYGJ3/MgsLClgAKwMDCwpYCCsDMqcLClgIKwMy4wsKWBgDMg8yLwsKWAAfAzIrCwpYIB8BtwsKWCAfAaMLClgIHwMyWwsKWAgfAzJHCwpYYB8DMksLClgIHwMygwsKWAwZGwMLClgYMzIzAwsKWAAXAwMLClggFwHjCwpYqAcyPzL7CwpYEAMyQzJTCwpYAC8DMk8LClgMLwMyIwsKWCQvAzJvCwpYDBmfAwsKWBgDMlcyYwsKWAAvAzJfCwpYYC8DMn8LClgMGzITAwsKWBgDMmcydwsKWAA/AzJzCwpYJD8BWwsKWCQ/AzInCwpYDG1LAwsKWBgDMnsyiwsKWAA/AzKHCwpYJD8BXwsKWCQ/AzLXCwpYDG1PAwsKWBgDMo8ynwsKWAAjAzKbCwpYDCMDAwsKWAwjAzK7CwpYDBnTAwsKWBgDMqMyswsKWAAjAzKvCwpYUCMDMpMLClgAIwMylwsKWAwdJwMLClgYAzK3MsMLClgAJwMyvwsKWAwnAwMLClgMHzI3AwsKWBjXMscyzwsKWAArAwMLClgIKwGDCwpYGNcy0zLbCwpYACsDAwsKWAgrAzLLCwpYGAMy3zLrCwpYABcDMucLClhQFwMDCwpYDAMyqwMLClgYAzLvAwsKWAAfAzL3CwpYCB8DAwsKWAwBjwMLCljIBzL/Mw8LClgQAzMDAwsKWAA3AzMLCwpYhDcDAwsKWAxHMhcDCwpbMrwrMxMzGwsKWCQ3AzMHCwpYEDcDAwsKWAgHMx8zKwsKWBgHMyMDCwpYADMDMxcLClgsMwBDCwpbNAjc2zMvMzcLClgkFwATCwpYEBcDAwsKWAgHMzszRwsKWBgHMz8DCwpYACMDMzMLClgkIwMDCwpYBDszQwMLC
====catalogjs annotation end====*/