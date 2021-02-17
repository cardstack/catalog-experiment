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
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFspXdvcmRzzLPAwNwAtZehbwAAA8CTeMyKzJLAmaFkCQACBJECwMKZoWmpdG9TdHJpbmcwkgLMrsAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgPwMCQwMKXoW8BAAYMkMCYoWcAAQcJkMDCmaFkBC4IwJIIBsDCmaFsq3JlQXNjaWlXb3JkkggLwMDABpDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXNjaWlXb3Jkcy5qc5ihcgALwMCRB8DCmaFkAQoKwJMLCgfAwpmhbKphc2NpaVdvcmRzkgrMscDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FzY2lpV29yZHMuanOYoXIJCsALkQnAwpihciELwMCRB8DCl6FvAQANE5DAmKFnAAEOEJDAwpmhZARHD8CSDw3AwpmhbLByZUhhc1VuaWNvZGVXb3Jkkg8SwMDADZDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzVW5pY29kZVdvcmQuanOYoXIAEMDAkQ7AwpmhZAEQEcCTEhEOwMKZoWyuaGFzVW5pY29kZVdvcmSSEcyvwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzVW5pY29kZVdvcmQuanOYoXIJDsASkRDAwpihchQQwMCRDsDCl6FvAQAUzKuQwJihZwABFTiQwMKZoWQEFBYXkhYUwMKZoWytcnNBc3RyYWxSYW5nZZMWS1nAwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADcDAkRXAwpmhZAYUGBmSGBTAwpmhbLFyc0NvbWJvTWFya3NSYW5nZZIYH8DAwBSQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgARwMCRF8DCmaFkBhQaG5IaFMDCmaFstXJlQ29tYm9IYWxmTWFya3NSYW5nZZIaIMDAwBSQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAVwMCRGcDCmaFkBhQcHZIcFMDCmaFss3JzQ29tYm9TeW1ib2xzUmFuZ2WSHCHAwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAE8DAkRvAwpmhZAYAHiKYHyAhHhQXGRvAwpmhbKxyc0NvbWJvUmFuZ2WSHkDAwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADMAfkR3AwpihcgMRwCCRF8DCmKFyAxXAIZEZwMKYoXIDE8DAkRvAwpmhZAYUIySSIxTAwpmhbK5yc0RpbmdiYXRSYW5nZZMjRU7AwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADsDAkSLAwpmhZAYeJSaSJRTAwpmhbKxyc0xvd2VyUmFuZ2WTJUhPwMDAFJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAzAwJEkwMKZoWQGGScokicUwMKZoWytcnNNYXRoT3BSYW5nZZInNMDAwBSQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgANwMCRJsDCmaFkBjEpKpIpFMDCmaFsrnJzTm9uQ2hhclJhbmdlkik1wMDAFJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAA7AwJEowMKZoWQGFCsskisUwMKZoWyycnNQdW5jdHVhdGlvblJhbmdlkis2wMDAFJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyABLAwJEqwMKZoWQGzKEtLpItFMDCmaFsrHJzU3BhY2VSYW5nZZItN8DAwBSQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAMwMCRLMDCmaFkBh4vMJIvFMDCmaFsrHJzVXBwZXJSYW5nZZMvUGDAwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIADMDAkS7AwpmhZAYTMTKSMRTAwpmhbKpyc1ZhclJhbmdlkjF3wMDAFJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAArAwJEwwMKZoWQGADPAmjQ1NjczFCYoKizAwpmhbKxyc0JyZWFrUmFuZ2WTMz1MwMDAFJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAzANJEywMKYoXIDDcA1kSbAwpihcgMOwDaRKMDCmKFyAxLAN5EqwMKYoXIDDMDAkSzAwpihZwEBOWOQwMKZoWQEDjo7kjo4wMKZoWymcnNBcG9zkzpuccDAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAGwMCROcDCmaFkBgY8PpQ9PDgywMKZoWyncnNCcmVha5M8zJjMnMDAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAHwD2RO8DCmKFyCQzAwJEywMKZoWQGBj9BlEA/OB3AwpmhbKdyc0NvbWJvkj9VwMDAOJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAfAQJE+wMKYoXIJDMDAkR3AwpmhZAYJQkOSQjjAwpmhbKhyc0RpZ2l0c5NCTcymwMDAOJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAjAwJFBwMKZoWQGBkRGlEVEOCLAwpmhbKlyc0RpbmdiYXSSRMyNwMDAOJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAnARZFDwMKYoXIJDsDAkSLAwpmhZAYGR0mUSEc4JMDCmaFsp3JzTG93ZXKTR2bMlsDAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAHwEiRRsDCmKFyCQzAwJEkwMKZoWQGBkpRnktMTU5PUEo4FTJBIiQuwMKZoWymcnNNaXNjk0pna8DAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAGwEuRScDCmKFyCg3ATJEVwMKYoXIDDMBNkTLAwpihcgMIwE6RQcDCmKFyAw7AT5EiwMKYoXIDDMBQkSTAwpihcgMMwMCRLsDCmaFkBh1SU5JSOMDCmaFspnJzRml0epJSVsDAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAGwMCRUcDCmaFkBgZUV5ZVVlQ4PlHAwpmhbKpyc01vZGlmaWVyklR0wMDAOJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAArAVZFTwMKYoXILB8BWkT7AwpihcgkGwMCRUcDCmaFkBgZYWpRZWDgVwMKZoWyrcnNOb25Bc3RyYWySWHzAwMA4kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAC8BZkVfAwpihcgoNwMCRFcDCmaFkBiRbXJJbOMDCmaFsqnJzUmVnaW9uYWyTW33MjsDAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwMCRWsDCmaFkBiddXpJdOMDCmaFsqnJzU3VyclBhaXKTXX7Mj8DAwDiQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAKwMCRXMDCmaFkBgZfYZRgXzguwMKZoWyncnNVcHBlcpdfasyVzJnMncyfzKLAwMA4kNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAB8BgkV7AwpihcgkMwMCRLsDCmaFkBgxiwJJiOMDCmaFspXJzWldKkmJ7wMDAOJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdW5pY29kZVdvcmRzLmpzmKFyAAXAwJFhwMKYoWcBAWTMkZDAwpmhZAQGZWiWZmdlY0ZJwMKZoWyrcnNNaXNjTG93ZXKTZcyezKDAwMBjkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAC8BmkWTAwpihcgsHwGeRRsDCmKFyCQbAwJFJwMKZoWQGBmlslmpraWNeScDCmaFsq3JzTWlzY1VwcGVykmnMmsDAwGOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgALwGqRaMDCmKFyCwfAa5FewMKYoXIJBsDAkUnAwpmhZAYbbW+Ubm1jOcDCmaFsr3JzT3B0Q29udHJMb3dlcpNtzJfMocDAwGOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5qc5ihcgAPwG6RbMDCmKFyCwbAwJE5wMKZoWQGG3BylHFwYznAwpmhbK9yc09wdENvbnRyVXBwZXKTcMybzKPAwMBjkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIAD8BxkW/AwpihcgsGwMCROcDCmaFkBgZzdZR0c2NTwMKZoWyocmVPcHRNb2STc8yAzIjAwMBjkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191bmljb2RlV29yZHMuanOYoXIACMB0kXLAwpihcgMKwMCRU8DCmaFkBgd2eJR3dmMwwMKZoWyocnNPcHRWYXKTdn/Mh8DAwGOQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VuaWNvZGVXb3Jkcy5q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
====catalogjs annotation end====*/