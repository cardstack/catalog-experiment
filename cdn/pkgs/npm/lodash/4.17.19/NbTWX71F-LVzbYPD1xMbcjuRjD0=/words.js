import { default as toString0 } from "./toString.js";
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
  string = toString0(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }

  return string.match(pattern) || [];
}
export { words as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFspXdvcmRzzLLAwNwAtJehbwAAA8CTd8yJzJHAmaFkCQACwJECwMKZoWmpdG9TdHJpbmcwkgLMrcAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFC5DAmKFnAAEGCJDAwpmhZAQuB8CSBwXAwpmhbKtyZUFzY2lpV29yZJIHCsDAwAWQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FzY2lpV29yZHMuanOYoXIAC8DAkQbAwpmhZAEKCcCTCgkGwMKZoWyqYXNjaWlXb3Jkc5IJzLDAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hc2NpaVdvcmRzLmpzmKFyCQrACpEIwMKYoXIhC8DAkQbAwpehbwEADBKQwJihZwABDQ+QwMKZoWQERw7Akg4MwMKZoWywcmVIYXNVbmljb2RlV29yZJIOEcDAwAyQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc1VuaWNvZGVXb3JkLmpzmKFyABDAwJENwMKZoWQBEBDAkxEQDcDCmaFsrmhhc1VuaWNvZGVXb3JkkhDMrsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2hhc1VuaWNvZGVXb3JkLmpzmKFyCQ7AEZEPwMKYoXIUEMDAkQ3AwpehbwEAE8yqkMCYoWcAARQ3kMDCmaFkBBQVFpIVE8DCmaFsrXJzQXN0cmFsUmFuZ2WTFUpYwMDAE5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA3AwJEUwMKZoWQGFBcYkhcTwMKZoWyxcnNDb21ib01hcmtzUmFuZ2WSFx7AwMATkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAEcDAkRbAwpmhZAYUGRqSGRPAwpmhbLVyZUNvbWJvSGFsZk1hcmtzUmFuZ2WSGR/AwMATkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAFcDAkRjAwpmhZAYUGxySGxPAwpmhbLNyc0NvbWJvU3ltYm9sc1JhbmdlkhsgwMDAE5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyABPAwJEawMKZoWQGAB0hmB4fIB0TFhgawMKZoWyscnNDb21ib1Jhbmdlkh0/wMDAE5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAzAHpEcwMKYoXIDEcAfkRbAwpihcgMVwCCRGMDCmKFyAxPAwJEawMKZoWQGFCIjkiITwMKZoWyucnNEaW5nYmF0UmFuZ2WTIkRNwMDAE5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA7AwJEhwMKZoWQGHiQlkiQTwMKZoWyscnNMb3dlclJhbmdlkyRHTsDAwBOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAMwMCRI8DCmaFkBhkmJ5ImE8DCmaFsrXJzTWF0aE9wUmFuZ2WSJjPAwMATkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADcDAkSXAwpmhZAYxKCmSKBPAwpmhbK5yc05vbkNoYXJSYW5nZZIoNMDAwBOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAOwMCRJ8DCmaFkBhQqK5IqE8DCmaFssnJzUHVuY3R1YXRpb25SYW5nZZIqNcDAwBOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgASwMCRKcDCmaFkBsyhLC2SLBPAwpmhbKxyc1NwYWNlUmFuZ2WSLDbAwMATkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADMDAkSvAwpmhZAYeLi+SLhPAwpmhbKxyc1VwcGVyUmFuZ2WTLk9fwMDAE5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAzAwJEtwMKZoWQGEzAxkjATwMKZoWyqcnNWYXJSYW5nZZIwdsDAwBOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwMCRL8DCmaFkBgAywJozNDU2MhMlJykrwMKZoWyscnNCcmVha1JhbmdlkzI8S8DAwBOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAMwDORMcDCmKFyAw3ANJElwMKYoXIDDsA1kSfAwpihcgMSwDaRKcDCmKFyAwzAwJErwMKYoWcBAThikMDCmaFkBA45OpI5N8DCmaFspnJzQXBvc5M5bXDAwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIABsDAkTjAwpmhZAYGOz2UPDs3McDCmaFsp3JzQnJlYWuTO8yXzJvAwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAB8A8kTrAwpihcgkMwMCRMcDCmaFkBgY+QJQ/PjccwMKZoWyncnNDb21ib5I+VMDAwDeQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAHwD+RPcDCmKFyCQzAwJEcwMKZoWQGCUFCkkE3wMKZoWyocnNEaWdpdHOTQUzMpcDAwDeQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAIwMCRQMDCmaFkBgZDRZREQzchwMKZoWypcnNEaW5nYmF0kkPMjMDAwDeQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAJwESRQsDCmKFyCQ7AwJEhwMKZoWQGBkZIlEdGNyPAwpmhbKdyc0xvd2Vyk0ZlzJXAwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAB8BHkUXAwpihcgkMwMCRI8DCmaFkBgZJUJ5KS0xNTk9JNxQxQCEjLcDCmaFspnJzTWlzY5NJZmrAwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIABsBKkUjAwpihcgoNwEuRFMDCmKFyAwzATJExwMKYoXIDCMBNkUDAwpihcgMOwE6RIcDCmKFyAwzAT5EjwMKYoXIDDMDAkS3AwpmhZAYdUVKSUTfAwpmhbKZyc0ZpdHqSUVXAwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIABsDAkVDAwpmhZAYGU1aWVFVTNz1QwMKZoWyqcnNNb2RpZmllcpJTc8DAwDeQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwFSRUsDCmKFyCwfAVZE9wMKYoXIJBsDAkVDAwpmhZAYGV1mUWFc3FMDCmaFsq3JzTm9uQXN0cmFskld7wMDAN5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAvAWJFWwMKYoXIKDcDAkRTAwpmhZAYkWluSWjfAwpmhbKpyc1JlZ2lvbmFsk1p8zI3AwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACsDAkVnAwpmhZAYnXF2SXDfAwpmhbKpyc1N1cnJQYWlyk1x9zI7AwMA3kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACsDAkVvAwpmhZAYGXmCUX143LcDCmaFsp3JzVXBwZXKXXmnMlMyYzJzMnsyhwMDAN5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAfAX5FdwMKYoXIJDMDAkS3AwpmhZAYMYcCSYTfAwpmhbKVyc1pXSpJhesDAwDeQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAFwMCRYMDCmKFnAQFjzJCQwMKZoWQEBmRnlmVmZGJFSMDCmaFsq3JzTWlzY0xvd2Vyk2TMncyfwMDAYpDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAvAZZFjwMKYoXILB8BmkUXAwpihcgkGwMCRSMDCmaFkBgZoa5ZpamhiXUjAwpmhbKtyc01pc2NVcHBlcpJozJnAwMBikNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAC8BpkWfAwpihcgsHwGqRXcDCmKFyCQbAwJFIwMKZoWQGG2xulG1sYjjAwpmhbK9yc09wdENvbnRyTG93ZXKTbMyWzKDAwMBikNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAD8BtkWvAwpihcgsGwMCROMDCmaFkBhtvcZRwb2I4wMKZoWyvcnNPcHRDb250clVwcGVyk2/MmsyiwMDAYpDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA/AcJFuwMKYoXILBsDAkTjAwpmhZAYGcnSUc3JiUsDCmaFsqHJlT3B0TW9kk3J/zIfAwMBikNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACMBzkXHAwpihcgMKwMCRUsDCmaFkBgd1d5R2dWIvwMKZoWyocnNPcHRWYXKTdX7MhsDAwGKQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAIwHaRdMDC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
====catalogjs annotation end====*/