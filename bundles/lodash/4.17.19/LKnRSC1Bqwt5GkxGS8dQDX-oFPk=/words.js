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

function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}



/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */

function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}



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

function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}







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


export { words as default };
/*====catalogjs annotation start====
lZGVwq0uL3RvU3RyaW5nLmpzAcLAgadkZWZhdWx0lKFspXdvcmRzzMHAkZPMwcDA3gAvqHRvU3RyaW5nm6FpkMICwJIDBMAAwKdkZWZhdWx0kKtyZUFzY2lpV29yZJuhbJDCBgmSBwjAwMDAkKphc2NpaVdvcmRzm6FskatyZUFzY2lpV29yZMIKwJILDJLZWWh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19hc2NpaVdvcmRzLmpzp2RlZmF1bHTAwMCQsHJlSGFzVW5pY29kZVdvcmSboWyQwg4Rkg8QwMDAwJCuaGFzVW5pY29kZVdvcmSboWyRsHJlSGFzVW5pY29kZVdvcmTCEsCSExSS2V1odHRwczovL2NhdGFsb2dqcy5jb20vcGtncy9ucG0vbG9kYXNoLzQuMTcuMTkvTEtuUlNDMUJxd3Q1R2t4R1M4ZFFEWC1vRlBrPS9faGFzVW5pY29kZVdvcmQuanOnZGVmYXVsdMDAwJCtcnNBc3RyYWxSYW5nZZuhbJDCFsCTFxgZwMDAwJCxcnNDb21ib01hcmtzUmFuZ2WboWyQwhrAkhscwMDAwJC1cmVDb21ib0hhbGZNYXJrc1Jhbmdlm6FskMIdwJIeH8DAwMCQs3JzQ29tYm9TeW1ib2xzUmFuZ2WboWyQwiDAkiEiwMDAwJCscnNDb21ib1Jhbmdlm6Fsk7Fyc0NvbWJvTWFya3NSYW5nZbVyZUNvbWJvSGFsZk1hcmtzUmFuZ2WzcnNDb21ib1N5bWJvbHNSYW5nZcIjJpIkJcDAwMCTsXJzQ29tYm9NYXJrc1JhbmdltXJlQ29tYm9IYWxmTWFya3NSYW5nZbNyc0NvbWJvU3ltYm9sc1JhbmdlrnJzRGluZ2JhdFJhbmdlm6FskMInwJMoKSrAwMDAkKxyc0xvd2VyUmFuZ2WboWyQwivAkywtLsDAwMCQrXJzTWF0aE9wUmFuZ2WboWyQwi/AkjAxwMDAwJCucnNOb25DaGFyUmFuZ2WboWyQwjLAkjM0wMDAwJCycnNQdW5jdHVhdGlvblJhbmdlm6FskMI1wJI2N8DAwMCQrHJzU3BhY2VSYW5nZZuhbJDCOMCSOTrAwMDAkKxyc1VwcGVyUmFuZ2WboWyQwjvAkzw9PsDAwMCQqnJzVmFyUmFuZ2WboWyQwj/AkkBBwMDAwJCscnNCcmVha1Jhbmdlm6FslK1yc01hdGhPcFJhbmdlrnJzTm9uQ2hhclJhbmdlsnJzUHVuY3R1YXRpb25SYW5nZaxyc1NwYWNlUmFuZ2XCQkaTQ0RFwMDAwJStcnNNYXRoT3BSYW5nZa5yc05vbkNoYXJSYW5nZbJyc1B1bmN0dWF0aW9uUmFuZ2WscnNTcGFjZVJhbmdlpnJzQXBvc5uhbJDCSMCTSUpLwMDAwJCncnNCcmVha5uhbJGscnNCcmVha1JhbmdlwkxQk01OT8DAwMCRrHJzQnJlYWtSYW5nZadyc0NvbWJvm6Fskaxyc0NvbWJvUmFuZ2XCUVSSUlPAwMDAkaxyc0NvbWJvUmFuZ2WocnNEaWdpdHOboWyQwlXAk1ZXWMDAwMCQqXJzRGluZ2JhdJuhbJGucnNEaW5nYmF0UmFuZ2XCWVySWlvAwMDAka5yc0RpbmdiYXRSYW5nZadyc0xvd2Vym6Fskaxyc0xvd2VyUmFuZ2XCXWGTXl9gwMDAwJGscnNMb3dlclJhbmdlpnJzTWlzY5uhbJatcnNBc3RyYWxSYW5nZaxyc0JyZWFrUmFuZ2WocnNEaWdpdHOucnNEaW5nYmF0UmFuZ2WscnNMb3dlclJhbmdlrHJzVXBwZXJSYW5nZcJiZpNjZGXAwMDAlq1yc0FzdHJhbFJhbmdlrnJzRGluZ2JhdFJhbmdlrHJzTG93ZXJSYW5nZaxyc1VwcGVyUmFuZ2WscnNCcmVha1JhbmdlqHJzRGlnaXRzpnJzRml0epuhbJDCZ8CSaGnAwMDAkKpyc01vZGlmaWVym6Fskqdyc0NvbWJvpnJzRml0esJqbZJrbMDAwMCSp3JzQ29tYm+mcnNGaXR6q3JzTm9uQXN0cmFsm6Fska1yc0FzdHJhbFJhbmdlwm5xkm9wwMDAwJGtcnNBc3RyYWxSYW5nZapyc1JlZ2lvbmFsm6FskMJywJNzdHXAwMDAkKpyc1N1cnJQYWlym6FskMJ2wJN3eHnAwMDAkKdyc1VwcGVym6Fskaxyc1VwcGVyUmFuZ2XCesyCl3t8fX5/zIDMgcDAwMCRrHJzVXBwZXJSYW5nZaVyc1pXSpuhbJDCzIPAksyEzIXAwMDAkKtyc01pc2NMb3dlcpuhbJKncnNMb3dlcqZyc01pc2PCzIfMi5PMiMyJzIrAwMDAkqdyc0xvd2VypnJzTWlzY6tyc01pc2NVcHBlcpuhbJKncnNVcHBlcqZyc01pc2PCzIzMj5LMjcyOwMDAwJKmcnNNaXNjp3JzVXBwZXKvcnNPcHRDb250ckxvd2Vym6FskaZyc0Fwb3PCzJDMlJPMkcySzJPAwMDAkaZyc0Fwb3OvcnNPcHRDb250clVwcGVym6FskaZyc0Fwb3PCzJXMmZPMlsyXzJjAwMDAkaZyc0Fwb3OocmVPcHRNb2SboWyRqnJzTW9kaWZpZXLCzJrMnpPMm8yczJ3AwMDAkapyc01vZGlmaWVyqHJzT3B0VmFym6Fskapyc1ZhclJhbmdlwsyfzKOTzKDMocyiwMDAwJGqcnNWYXJSYW5nZalyc09wdEpvaW6boWyWpXJzWldKq3JzTm9uQXN0cmFsqnJzUmVnaW9uYWyqcnNTdXJyUGFpcqhyc09wdFZhcqhyZU9wdE1vZMLMpMynksylzKbAwMDAlqtyc05vbkFzdHJhbKpyc1JlZ2lvbmFsqnJzU3VyclBhaXKlcnNaV0qocmVPcHRNb2SocnNPcHRWYXKqcnNPcmRMb3dlcpuhbJDCzKjAksypzKrAwMDAkKpyc09yZFVwcGVym6FskMLMq8CSzKzMrcDAwMCQpXJzU2Vxm6Fsk6hyc09wdFZhcqhyZU9wdE1vZKlyc09wdEpvaW7CzK7MsZLMr8ywwMDAwJOocmVPcHRNb2SocnNPcHRWYXKpcnNPcHRKb2lup3JzRW1vammboWyUqXJzRGluZ2JhdKpyc1JlZ2lvbmFsqnJzU3VyclBhaXKlcnNTZXHCzLLMtZLMs8y0wMDAwJSpcnNEaW5nYmF0qnJzUmVnaW9uYWyqcnNTdXJyUGFpcqVyc1Nlca1yZVVuaWNvZGVXb3Jkm6FsnKZSZWdFeHCncnNVcHBlcqdyc0xvd2Vyr3JzT3B0Q29udHJMb3dlcqdyc0JyZWFrq3JzTWlzY1VwcGVyr3JzT3B0Q29udHJVcHBlcqtyc01pc2NMb3dlcqpyc09yZFVwcGVyqnJzT3JkTG93ZXKocnNEaWdpdHOncnNFbW9qacLMt8y6ksy4zLnAwMDAm6dyc0JyZWFrqHJzRGlnaXRzp3JzTG93ZXKncnNVcHBlcqtyc01pc2NMb3dlcqtyc01pc2NVcHBlcq9yc09wdENvbnRyTG93ZXKvcnNPcHRDb250clVwcGVyqnJzT3JkTG93ZXKqcnNPcmRVcHBlcqdyc0Vtb2pprHVuaWNvZGVXb3Jkc5uhbJGtcmVVbmljb2RlV29yZMLMu8CSzLzMvZLZW2h0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L191bmljb2RlV29yZHMuanOnZGVmYXVsdMDAwJCld29yZHOboWyUqHRvU3RyaW5nrmhhc1VuaWNvZGVXb3JkrHVuaWNvZGVXb3Jkc6phc2NpaVdvcmRzwsy+wJLMv8zAwMDAwJDcAMKWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLCliYIwBTCwpZCAQYKwsKWBAAHwMLClgALwAnCwpYhC8DAwsKWAyvAwMLClsyuCgsNwsKWCQrACMLClgsKwMDCwpZRAQ4SwsKWBAAPwMLClgAQwBHCwpYUEMDAwsKWA0TAwMLClszUEBMVwsKWCQ7AEMLCll4OwMy9wsKWNgEWR8LClgQUFxrCwpYADcDAwsKWBw3ARcLClgcNwMDCwpYGFBsdwsKWABHAwMLClgARwB/CwpYGFB4gwsKWABXAwMLClgMVwCLCwpYGFCEjwsKWABPAwMLClgMTwMDCwpYGACQnwsKWAAzAJsLClgYMwMDCwpYDABzAwsKWBhQoK8LClgAOwMDCwpYGDsDAwsKWAw7ALsLClgYeLC/CwpYADMDAwsKWBgzAwMLClgMMwD3CwpYGGTAywsKWAA3AwMLClgANwDTCwpYGMTM1wsKWAA7AwMLClgMOwDfCwpYGFDY4wsKWABLAwMLClgMSwDrCwpYGzKE5O8LClgAMwMDCwpYDDMDAwsKWBh48P8LClgAMwMDCwpYDDMDAwsKWBgzAwMLClgYTQELCwpYACsDAwsKWBgrAwMLClgYAQ8DCwpYADMBGwsKWBgzAwMLClgMMwFfCwpYDADHAwsKWMQFIzIbCwpYEDklMwsKWAAbAwMLClggGwMDCwpYIBsDAwsKWBgBNUcLClgAHwFDCwpYMB8B+wsKWDAfAf8LClgMGRMDCwpYGAFJVwsKWAAfAVMLClggHwGnCwpYDBiXAwsKWBglWWcLClgAIwMDCwpYDCMAqwsKWAgjAzLTCwpYGAFpdwsKWAAnAXMLClgkJwHXCwpYDBinAwsKWBgBeYsLClgAHwGHCwpYIB8BkwsKWCQfAzJLCwpYDBi3AwsKWBgBjZ8LClgAGwGbCwpYJBsDAwsKWCQbAwMLClgMGGMDCwpYGHWhqwsKWAAbAwMLClgkGwMDCwpYGAGtuwsKWAArAbcLClgAKwMDCwpYDBlPAwsKWBgBvcsLClgALwHHCwpYMC8B0wsKWAwYZwMLClgYkc3bCwpYACsDAwsKWAgrAeMLClgIKwHnCwpYGJ3d6wsKWAArAwMLClgIKwMyhwsKWAgrAzLDCwpYGAHvMg8LClgAHwMyCwsKWCAfAZcLClggHwGDCwpYCB8DMjsLClgIHwMyJwsKWGAfAzIrCwpYCB8DMmMLClgMGPsDCwpYGDMyEwMLClgAFwMDCwpYIBcBwwsKWKgHMh8y2wsKWBADMiMyMwsKWAAvAzIvCwpYDC8DMgMLClgkLwMyTwsKWAwZfwMLClgYAzI3MkMLClgALwMyPwsKWGAvAzJfCwpYDBnzAwsKWBgDMkcyVwsKWAA/AzJTCwpYJD8BOwsKWCQ/AzIHCwpYDG0rAwsKWBgDMlsyawsKWAA/AzJnCwpYJD8BPwsKWCQ/AzK3CwpYDG0vAwsKWBgDMm8yfwsKWAAjAzJ7CwpYDCMDAwsKWAwjAzKbCwpYDBmzAwsKWBgDMoMykwsKWAAjAzKPCwpYUCMDMnMLClgAIwMydwsKWAwdBwMLClgYAzKXMqMLClgAJwMynwsKWAwnAwMLClgMHzIXAwsKWBjXMqcyrwsKWAArAwMLClgIKwFjCwpYGNcyszK7CwpYACsDAwsKWAgrAzKrCwpYGAMyvzLLCwpYABcDMscLClhQFwMDCwpYDAMyiwMLClgYAzLPAwsKWAAfAzLXCwpYCB8DAwsKWAwBbwMLCljIBzLfMu8LClgQAzLjAwsKWAA3AzLrCwpYhDcDAwsKWAxF9wMLClsyvCsy8zL7CwpYJDMDMucLClgsMwAzCwpbNAjk2zL/MwcLClgkFwATCwpYJBcDAwsKWAw7MwMDCwg==
====catalogjs annotation end====*/