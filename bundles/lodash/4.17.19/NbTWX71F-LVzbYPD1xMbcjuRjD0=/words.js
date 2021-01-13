import { default as toString } from "./toString.js";
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}
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
var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')', rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower, rsUpper + '+' + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji].join('|'), 'g');
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}
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
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFspXdvcmRzzLLA3AC0l6FvAAADwJcID8ynd8yJzJHMq8CZoWQJAALAkQLAwpihaah0b1N0cmluZ5ICzK3AAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFC5DAmKFnAAEGCJDAwpmhZAQuB8CSBwXAwpihbKtyZUFzY2lpV29yZJIHCsDAwAXZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXNjaWlXb3Jkcy5qc5ihcgALwMCRBsDCmaFkAQoJwJMKCQbAwpihbKphc2NpaVdvcmRzkgnMsMDAwMDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXNjaWlXb3Jkcy5qc5ihcgkKwAqRCMDCmKFyIQvAwJEGwMKXoW8BAAwSkMCYoWcAAQ0PkMDCmaFkBEcOwJIODMDCmKFssHJlSGFzVW5pY29kZVdvcmSSDhHAwMAM2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc1VuaWNvZGVXb3JkLmpzmKFyABDAwJENwMKZoWQBEBDAkxEQDcDCmKFsrmhhc1VuaWNvZGVXb3JkkhDMrsDAwMDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzVW5pY29kZVdvcmQuanOYoXIJDsARkQ/AwpihchQQwMCRDcDCl6FvAQATzKqQwJihZwABFDeQwMKZoWQEFBUWkhUTwMKYoWytcnNBc3RyYWxSYW5nZZMVSljAwMAT2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgANwMCRFMDCmaFkBhQXGJIXE8DCmKFssXJzQ29tYm9NYXJrc1JhbmdlkhcewMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAEcDAkRbAwpmhZAYUGRqSGRPAwpihbLVyZUNvbWJvSGFsZk1hcmtzUmFuZ2WSGR/AwMAT2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAVwMCRGMDCmaFkBhQbHJIbE8DCmKFss3JzQ29tYm9TeW1ib2xzUmFuZ2WSGyDAwMAT2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgATwMCRGsDCmaFkBgAdIZgeHyAdExYYGsDCmKFsrHJzQ29tYm9SYW5nZZIdP8DAwBPZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAzAHpEcwMKYoXIDEcAfkRbAwpihcgMVwCCRGMDCmKFyAxPAwJEawMKZoWQGFCIjkiITwMKYoWyucnNEaW5nYmF0UmFuZ2WTIkRNwMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADsDAkSHAwpmhZAYeJCWSJBPAwpihbKxyc0xvd2VyUmFuZ2WTJEdOwMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADMDAkSPAwpmhZAYZJieSJhPAwpihbK1yc01hdGhPcFJhbmdlkiYzwMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADcDAkSXAwpmhZAYxKCmSKBPAwpihbK5yc05vbkNoYXJSYW5nZZIoNMDAwBPZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA7AwJEnwMKZoWQGFCorkioTwMKYoWyycnNQdW5jdHVhdGlvblJhbmdlkio1wMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAEsDAkSnAwpmhZAbMoSwtkiwTwMKYoWyscnNTcGFjZVJhbmdlkiw2wMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADMDAkSvAwpmhZAYeLi+SLhPAwpihbKxyc1VwcGVyUmFuZ2WTLk9fwMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADMDAkS3AwpmhZAYTMDGSMBPAwpihbKpyc1ZhclJhbmdlkjB2wMDAE9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACsDAkS/AwpmhZAYAMsCaMzQ1NjITJScpK8DCmKFsrHJzQnJlYWtSYW5nZZMyPEvAwMAT2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAMwDORMcDCmKFyAw3ANJElwMKYoXIDDsA1kSfAwpihcgMSwDaRKcDCmKFyAwzAwJErwMKYoWcBAThikMDCmaFkBA45OpI5N8DCmKFspnJzQXBvc5M5bXDAwMA32U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAGwMCROMDCmaFkBgY7PZQ8OzcxwMKYoWyncnNCcmVha5M7zJfMm8DAwDfZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAfAPJE6wMKYoXIJDMDAkTHAwpmhZAYGPkCUPz43HMDCmKFsp3JzQ29tYm+SPlTAwMA32U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAHwD+RPcDCmKFyCQzAwJEcwMKZoWQGCUFCkkE3wMKYoWyocnNEaWdpdHOTQUzMpcDAwDfZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAjAwJFAwMKZoWQGBkNFlERDNyHAwpihbKlyc0RpbmdiYXSSQ8yMwMDAN9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACcBEkULAwpihcgkOwMCRIcDCmaFkBgZGSJRHRjcjwMKYoWyncnNMb3dlcpNGZcyVwMDAN9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAB8BHkUXAwpihcgkMwMCRI8DCmaFkBgZJUJ5KS0xNTk9JNxQxQCEjLcDCmKFspnJzTWlzY5NJZmrAwMA32U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAGwEqRSMDCmKFyCg3AS5EUwMKYoXIDDMBMkTHAwpihcgMIwE2RQMDCmKFyAw7ATpEhwMKYoXIDDMBPkSPAwpihcgMMwMCRLcDCmaFkBh1RUpJRN8DCmKFspnJzRml0epJRVcDAwDfZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAbAwJFQwMKZoWQGBlNWllRVUzc9UMDCmKFsqnJzTW9kaWZpZXKSU3PAwMA32U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwFSRUsDCmKFyCwfAVZE9wMKYoXIJBsDAkVDAwpmhZAYGV1mUWFc3FMDCmKFsq3JzTm9uQXN0cmFskld7wMDAN9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAC8BYkVbAwpihcgoNwMCRFMDCmaFkBiRaW5JaN8DCmKFsqnJzUmVnaW9uYWyTWnzMjcDAwDfZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAArAwJFZwMKZoWQGJ1xdklw3wMKYoWyqcnNTdXJyUGFpcpNcfcyOwMDAN9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACsDAkVvAwpmhZAYGXmCUX143LcDCmKFsp3JzVXBwZXKXXmnMlMyYzJzMnsyhwMDAN9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAB8BfkV3AwpihcgkMwMCRLcDCmaFkBgxhwJJhN8DCmKFspXJzWldKkmF6wMDAN9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIABcDAkWDAwpihZwEBY8yQkMDCmaFkBAZkZ5ZlZmRiRUjAwpihbKtyc01pc2NMb3dlcpNkzJ3Mn8DAwGLZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAvAZZFjwMKYoXILB8BmkUXAwpihcgkGwMCRSMDCmaFkBgZoa5ZpamhiXUjAwpihbKtyc01pc2NVcHBlcpJozJnAwMBi2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgALwGmRZ8DCmKFyCwfAapFdwMKYoXIJBsDAkUjAwpmhZAYbbG6UbWxiOMDCmKFsr3JzT3B0Q29udHJMb3dlcpNszJbMoMDAwGLZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA/AbZFrwMKYoXILBsDAkTjAwpmhZAYbb3GUcG9iOMDCmKFsr3JzT3B0Q29udHJVcHBlcpNvzJrMosDAwGLZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA/AcJFuwMKYoXILBsDAkTjAwpmhZAYGcnSUc3JiUsDCmKFsqHJlT3B0TW9kk3J/zIfAwMBi2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAIwHORccDCmKFyAwrAwJFSwMKZoWQGB3V3lHZ1Yi/AwpihbKhyc09wdFZhcpN1fsyGwMDAYtlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACMB2kXTAwpihcgkKwMCRL8DCmaFkBgB4zICZeGJ5YFZZW3RxwMKYoWypcnNPcHRKb2luknjMiMDAwGLZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAnAeZF3wMKYoWcDB3rAl3p7fH1+f3fAwpihcggFwHuRYMDCmKFyDAvAfJFWwMKYoXICCsB9kVnAwpihcgIKwH6RW8DCmKFyFAjAf5F0wMKYoXIDCMDAkXHAwpmhZAY1zIHMgpLMgWLAwpihbKpyc09yZExvd2VyksyBzKTAwMBi2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwMCRzIDAwpmhZAY1zIPMhJLMg2LAwpihbKpyc09yZFVwcGVyksyDzKPAwMBi2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwMCRzILAwpmhZAYAzIXMiZjMhsyHzIjMhWJ0cXfAwpihbKVyc1NlcZLMhcyPwMDAYtlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIABcDMhpHMhMDCmKFyAwjAzIeRdMDCmKFyAwjAzIiRccDCmKFyAwnAwJF3wMKZoWQGAMyKwJfMimLMi0JZW8yEwMKYoWyncnNFbW9qaZLMisymwMDAYtlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAB8DMi5HMicDCmKFnAwDMjMCVzIzMjcyOzI/MicDCmKFyCQnAzI2RQsDCmKFyAgrAzI6RWcDCmKFyAgrAzI+RW8DCmKFyFAXAwJHMhMDCmKFnAQHMkcynkMDCmaFkBADMksCezJLMkMyTXUVrOmduY8yCzIBAzInAwpihbK1yZVVuaWNvZGVXb3JkksySzKnAwMDMkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADcDMk5HMkcDCmKFnAxHMlMDcABTMlMyVzJbMl8yYzJnMmsybzJzMncyezJ/MoMyhzKLMo8ykzKXMpsyRwMKYoXIIB8DMlZFdwMKYoXIJB8DMlpFFwMKYoXIJD8DMl5FrwMKYoXIMB8DMmJE6wMKYoXICB8DMmZFdwMKYoXIYC8DMmpFnwMKYoXIJD8DMm5FuwMKYoXIMB8DMnJE6wMKYoXICB8DMnZFdwMKYoXIDC8DMnpFjwMKYoXIYB8DMn5FdwMKYoXIJC8DMoJFjwMKYoXIJD8DMoZFrwMKYoXICB8DMopFdwMKYoXIJD8DMo5FuwMKYoXICCsDMpJHMgsDCmKFyAgrAzKWRzIDAwpihcgIIwMymkUDAwpihcgIHwMCRzInAwpmhZAEKzKjAk8ypzKjMkcDCmKFsrHVuaWNvZGVXb3Jkc5LMqMyvwMDAwNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIJDMDMqZHMp8DCmKFyIQ3AwJHMkcDCl6FvAQDMq8yxkMCZoWQANsyswJXMrcyuzK/MsMyswMKYoWyld29yZHOSzKzMs8DAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy93b3Jkcy5qc5ihcgkFwMytkcyrwMKYoXImCMDMrpEBwMKYoXJeDsDMr5EPwMKYoXILDMDMsJHMp8DCmKFyCwrAwJEIwMKYoWcBA8yywJDAwpihZwkLzLPAkcyzwMKYoXIABcDAkcyrwMI=
====catalogjs annotation end====*/