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
lZGTwq0uL3RvU3RyaW5nLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdMzRwJGTzNHAwt4AM6h0b1N0cmluZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCrcmVBc2NpaVdvcmSboWyQwgYJkgcIwMDAwJCrYXNjaWlXb3JkczCboWyRq3JlQXNjaWlXb3JkwgrAkgsMwMDAwJCqYXNjaWlXb3Jkc5uhbJGrYXNjaWlXb3JkczDCDsCSDxCS2VlodHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9fYXNjaWlXb3Jkcy5qc6dkZWZhdWx0wMDAkLByZUhhc1VuaWNvZGVXb3Jkm6FskMISFZITFMDAwMCQr2hhc1VuaWNvZGVXb3JkMJuhbJGwcmVIYXNVbmljb2RlV29yZMIWwJIXGMDAwMCQrmhhc1VuaWNvZGVXb3Jkm6Fska9oYXNVbmljb2RlV29yZDDCGsCSGxyS2V1odHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9faGFzVW5pY29kZVdvcmQuanOnZGVmYXVsdMDAwJCtcnNBc3RyYWxSYW5nZZuhbJDCHsCTHyAhwMDAwJCxcnNDb21ib01hcmtzUmFuZ2WboWyQwiLAkiMkwMDAwJC1cmVDb21ib0hhbGZNYXJrc1Jhbmdlm6FskMIlwJImJ8DAwMCQs3JzQ29tYm9TeW1ib2xzUmFuZ2WboWyQwijAkikqwMDAwJCscnNDb21ib1Jhbmdlm6Fsk7Fyc0NvbWJvTWFya3NSYW5nZbVyZUNvbWJvSGFsZk1hcmtzUmFuZ2WzcnNDb21ib1N5bWJvbHNSYW5nZcIrLpIsLcDAwMCTsXJzQ29tYm9NYXJrc1JhbmdltXJlQ29tYm9IYWxmTWFya3NSYW5nZbNyc0NvbWJvU3ltYm9sc1JhbmdlrnJzRGluZ2JhdFJhbmdlm6FskMIvwJMwMTLAwMDAkKxyc0xvd2VyUmFuZ2WboWyQwjPAkzQ1NsDAwMCQrXJzTWF0aE9wUmFuZ2WboWyQwjfAkjg5wMDAwJCucnNOb25DaGFyUmFuZ2WboWyQwjrAkjs8wMDAwJCycnNQdW5jdHVhdGlvblJhbmdlm6FskMI9wJI+P8DAwMCQrHJzU3BhY2VSYW5nZZuhbJDCQMCSQULAwMDAkKxyc1VwcGVyUmFuZ2WboWyQwkPAk0RFRsDAwMCQqnJzVmFyUmFuZ2WboWyQwkfAkkhJwMDAwJCscnNCcmVha1Jhbmdlm6FslK1yc01hdGhPcFJhbmdlrnJzTm9uQ2hhclJhbmdlsnJzUHVuY3R1YXRpb25SYW5nZaxyc1NwYWNlUmFuZ2XCSk6TS0xNwMDAwJStcnNNYXRoT3BSYW5nZa5yc05vbkNoYXJSYW5nZbJyc1B1bmN0dWF0aW9uUmFuZ2WscnNTcGFjZVJhbmdlpnJzQXBvc5uhbJDCUMCTUVJTwMDAwJCncnNCcmVha5uhbJGscnNCcmVha1JhbmdlwlRYk1VWV8DAwMCRrHJzQnJlYWtSYW5nZadyc0NvbWJvm6Fskaxyc0NvbWJvUmFuZ2XCWVySWlvAwMDAkaxyc0NvbWJvUmFuZ2WocnNEaWdpdHOboWyQwl3Ak15fYMDAwMCQqXJzRGluZ2JhdJuhbJGucnNEaW5nYmF0UmFuZ2XCYWSSYmPAwMDAka5yc0RpbmdiYXRSYW5nZadyc0xvd2Vym6Fskaxyc0xvd2VyUmFuZ2XCZWmTZmdowMDAwJGscnNMb3dlclJhbmdlpnJzTWlzY5uhbJatcnNBc3RyYWxSYW5nZaxyc0JyZWFrUmFuZ2WocnNEaWdpdHOucnNEaW5nYmF0UmFuZ2WscnNMb3dlclJhbmdlrHJzVXBwZXJSYW5nZcJqbpNrbG3AwMDAlq1yc0FzdHJhbFJhbmdlrnJzRGluZ2JhdFJhbmdlrHJzTG93ZXJSYW5nZaxyc1VwcGVyUmFuZ2WscnNCcmVha1JhbmdlqHJzRGlnaXRzpnJzRml0epuhbJDCb8CScHHAwMDAkKpyc01vZGlmaWVym6Fskqdyc0NvbWJvpnJzRml0esJydZJzdMDAwMCSp3JzQ29tYm+mcnNGaXR6q3JzTm9uQXN0cmFsm6Fska1yc0FzdHJhbFJhbmdlwnZ5knd4wMDAwJGtcnNBc3RyYWxSYW5nZapyc1JlZ2lvbmFsm6FskMJ6wJN7fH3AwMDAkKpyc1N1cnJQYWlym6FskMJ+wJN/zIDMgcDAwMCQp3JzVXBwZXKboWyRrHJzVXBwZXJSYW5nZcLMgsyKl8yDzITMhcyGzIfMiMyJwMDAwJGscnNVcHBlclJhbmdlpXJzWldKm6FskMLMi8CSzIzMjcDAwMCQq3JzTWlzY0xvd2Vym6Fskqdyc0xvd2VypnJzTWlzY8LMj8yTk8yQzJHMksDAwMCSp3JzTG93ZXKmcnNNaXNjq3JzTWlzY1VwcGVym6Fskqdyc1VwcGVypnJzTWlzY8LMlMyXksyVzJbAwMDAkqZyc01pc2OncnNVcHBlcq9yc09wdENvbnRyTG93ZXKboWyRpnJzQXBvc8LMmMyck8yZzJrMm8DAwMCRpnJzQXBvc69yc09wdENvbnRyVXBwZXKboWyRpnJzQXBvc8LMncyhk8yezJ/MoMDAwMCRpnJzQXBvc6hyZU9wdE1vZJuhbJGqcnNNb2RpZmllcsLMosymk8yjzKTMpcDAwMCRqnJzTW9kaWZpZXKocnNPcHRWYXKboWyRqnJzVmFyUmFuZ2XCzKfMq5PMqMypzKrAwMDAkapyc1ZhclJhbmdlqXJzT3B0Sm9pbpuhbJalcnNaV0qrcnNOb25Bc3RyYWyqcnNSZWdpb25hbKpyc1N1cnJQYWlyqHJzT3B0VmFyqHJlT3B0TW9kwsyszK+SzK3MrsDAwMCWq3JzTm9uQXN0cmFsqnJzUmVnaW9uYWyqcnNTdXJyUGFpcqVyc1pXSqhyZU9wdE1vZKhyc09wdFZhcqpyc09yZExvd2Vym6FskMLMsMCSzLHMssDAwMCQqnJzT3JkVXBwZXKboWyQwsyzwJLMtMy1wMDAwJClcnNTZXGboWyTqHJzT3B0VmFyqHJlT3B0TW9kqXJzT3B0Sm9pbsLMtsy5ksy3zLjAwMDAk6hyZU9wdE1vZKhyc09wdFZhcqlyc09wdEpvaW6ncnNFbW9qaZuhbJSpcnNEaW5nYmF0qnJzUmVnaW9uYWyqcnNTdXJyUGFpcqVyc1NlccLMusy9ksy7zLzAwMDAlKlyc0RpbmdiYXSqcnNSZWdpb25hbKpyc1N1cnJQYWlypXJzU2VxrXJlVW5pY29kZVdvcmSboWycplJlZ0V4cKdyc1VwcGVyp3JzTG93ZXKvcnNPcHRDb250ckxvd2Vyp3JzQnJlYWurcnNNaXNjVXBwZXKvcnNPcHRDb250clVwcGVyq3JzTWlzY0xvd2VyqnJzT3JkVXBwZXKqcnNPcmRMb3dlcqhyc0RpZ2l0c6dyc0Vtb2ppwsy/zMKSzMDMwcDAwMCbp3JzQnJlYWuocnNEaWdpdHOncnNMb3dlcqdyc1VwcGVyq3JzTWlzY0xvd2Vyq3JzTWlzY1VwcGVyr3JzT3B0Q29udHJMb3dlcq9yc09wdENvbnRyVXBwZXKqcnNPcmRMb3dlcqpyc09yZFVwcGVyp3JzRW1vammtdW5pY29kZVdvcmRzMJuhbJGtcmVVbmljb2RlV29yZMLMw8CSzMTMxcDAwMCQrHVuaWNvZGVXb3Jkc5uhbJGtdW5pY29kZVdvcmRzMMLMx8CSzMjMyZLZW2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L191bmljb2RlV29yZHMuanOnZGVmYXVsdMDAwJCld29yZHOboWyUqHRvU3RyaW5nrmhhc1VuaWNvZGVXb3JkrHVuaWNvZGVXb3Jkc6phc2NpaVdvcmRzwszKwJLMy8zMwMDAwJCoX2RlZmF1bHSboWyRpXdvcmRzwszOwJLMz8zQwMDAwJDcANKWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLCliYIwBzCwpZCAQYKwsKWBAAHwMLClgALwAnCwpYhC8DAwsKWAyvAwMLClsyuCgsNwsKWCQvACMLClgQLwMDCwpYCAQ4RwsKWBgEPwMLClgAKwAzCwpYLCsDAwsKWTwESFsLClgQAE8DCwpYAEMAVwsKWFBDAwMLClgNEwMDCwpbM1BAXGcLClgkPwBTCwpYED8DAwsKWAgEaHcLClgYBG8DCwpYADsAYwsKWXg7AzMnCwpY0AR5PwsKWBBQfIsLClgANwMDCwpYHDcBNwsKWBw3AwMLClgYUIyXCwpYAEcDAwsKWABHAJ8LClgYUJijCwpYAFcDAwsKWAxXAKsLClgYUKSvCwpYAE8DAwsKWAxPAwMLClgYALC/CwpYADMAuwsKWBgzAwMLClgMAJMDCwpYGFDAzwsKWAA7AwMLClgYOwMDCwpYDDsA2wsKWBh40N8LClgAMwMDCwpYGDMDAwsKWAwzARcLClgYZODrCwpYADcDAwsKWAA3APMLClgYxOz3CwpYADsDAwsKWAw7AP8LClgYUPkDCwpYAEsDAwsKWAxLAQsLClgbMoUFDwsKWAAzAwMLClgMMwMDCwpYGHkRHwsKWAAzAwMLClgMMwMDCwpYGDMDAwsKWBhNISsLClgAKwMDCwpYGCsDAwsKWBgBLwMLClgAMwE7CwpYGDMDAwsKWAwzAX8LClgMAOcDCwpYxAVDMjsLClgQOUVTCwpYABsDAwsKWCAbAwMLClggGwMDCwpYGAFVZwsKWAAfAWMLClgwHwMyGwsKWDAfAzIfCwpYDBkzAwsKWBgBaXcLClgAHwFzCwpYIB8BxwsKWAwYtwMLClgYJXmHCwpYACMDAwsKWAwjAMsLClgIIwMy8wsKWBgBiZcLClgAJwGTCwpYJCcB9wsKWAwYxwMLClgYAZmrCwpYAB8BpwsKWCAfAbMLClgkHwMyawsKWAwY1wMLClgYAa2/CwpYABsBuwsKWCQbAwMLClgkGwMDCwpYDBiDAwsKWBh1wcsLClgAGwMDCwpYJBsDAwsKWBgBzdsLClgAKwHXCwpYACsDAwsKWAwZbwMLClgYAd3rCwpYAC8B5wsKWDAvAfMLClgMGIcDCwpYGJHt+wsKWAArAwMLClgIKwMyAwsKWAgrAzIHCwpYGJ3/MgsLClgAKwMDCwpYCCsDMqcLClgIKwMy4wsKWBgDMg8yLwsKWAAfAzIrCwpYIB8BtwsKWCAfAaMLClgIHwMyWwsKWAgfAzJHCwpYYB8DMksLClgIHwMygwsKWAwZGwMLClgYMzIzAwsKWAAXAwMLClggFwHjCwpYqAcyPzL7CwpYEAMyQzJTCwpYAC8DMk8LClgMLwMyIwsKWCQvAzJvCwpYDBmfAwsKWBgDMlcyYwsKWAAvAzJfCwpYYC8DMn8LClgMGzITAwsKWBgDMmcydwsKWAA/AzJzCwpYJD8BWwsKWCQ/AzInCwpYDG1LAwsKWBgDMnsyiwsKWAA/AzKHCwpYJD8BXwsKWCQ/AzLXCwpYDG1PAwsKWBgDMo8ynwsKWAAjAzKbCwpYDCMDAwsKWAwjAzK7CwpYDBnTAwsKWBgDMqMyswsKWAAjAzKvCwpYUCMDMpMLClgAIwMylwsKWAwdJwMLClgYAzK3MsMLClgAJwMyvwsKWAwnAwMLClgMHzI3AwsKWBjXMscyzwsKWAArAwMLClgIKwGDCwpYGNcy0zLbCwpYACsDAwsKWAgrAzLLCwpYGAMy3zLrCwpYABcDMucLClhQFwMDCwpYDAMyqwMLClgYAzLvAwsKWAAfAzL3CwpYCB8DAwsKWAwBjwMLCljIBzL/Mw8LClgQAzMDAwsKWAA3AzMLCwpYhDcDAwsKWAxHMhcDCwpbMrwrMxMzGwsKWCQ3AzMHCwpYEDcDAwsKWAgHMx8zKwsKWBgHMyMDCwpYADMDMxcLClgsMwBDCwpbNAjc2zMvMzcLClgkFwATCwpYEBcDAwsKWAgHMzszRwsKWBgHMz8DCwpYACMDMzMLClgkIwMDCwpYBDszQwMLC
====catalogjs annotation end====*/