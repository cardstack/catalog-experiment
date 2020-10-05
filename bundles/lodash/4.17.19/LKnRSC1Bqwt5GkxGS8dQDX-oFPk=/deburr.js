import { default as basePropertyOf } from "./dist/147.js";
import { default as toString } from "./toString.js";


/** Used to map Latin Unicode letters to basic Latin letters. */

var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',
  '\xc1': 'A',
  '\xc2': 'A',
  '\xc3': 'A',
  '\xc4': 'A',
  '\xc5': 'A',
  '\xe0': 'a',
  '\xe1': 'a',
  '\xe2': 'a',
  '\xe3': 'a',
  '\xe4': 'a',
  '\xe5': 'a',
  '\xc7': 'C',
  '\xe7': 'c',
  '\xd0': 'D',
  '\xf0': 'd',
  '\xc8': 'E',
  '\xc9': 'E',
  '\xca': 'E',
  '\xcb': 'E',
  '\xe8': 'e',
  '\xe9': 'e',
  '\xea': 'e',
  '\xeb': 'e',
  '\xcc': 'I',
  '\xcd': 'I',
  '\xce': 'I',
  '\xcf': 'I',
  '\xec': 'i',
  '\xed': 'i',
  '\xee': 'i',
  '\xef': 'i',
  '\xd1': 'N',
  '\xf1': 'n',
  '\xd2': 'O',
  '\xd3': 'O',
  '\xd4': 'O',
  '\xd5': 'O',
  '\xd6': 'O',
  '\xd8': 'O',
  '\xf2': 'o',
  '\xf3': 'o',
  '\xf4': 'o',
  '\xf5': 'o',
  '\xf6': 'o',
  '\xf8': 'o',
  '\xd9': 'U',
  '\xda': 'U',
  '\xdb': 'U',
  '\xdc': 'U',
  '\xf9': 'u',
  '\xfa': 'u',
  '\xfb': 'u',
  '\xfc': 'u',
  '\xdd': 'Y',
  '\xfd': 'y',
  '\xff': 'y',
  '\xc6': 'Ae',
  '\xe6': 'ae',
  '\xde': 'Th',
  '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',
  '\u0102': 'A',
  '\u0104': 'A',
  '\u0101': 'a',
  '\u0103': 'a',
  '\u0105': 'a',
  '\u0106': 'C',
  '\u0108': 'C',
  '\u010a': 'C',
  '\u010c': 'C',
  '\u0107': 'c',
  '\u0109': 'c',
  '\u010b': 'c',
  '\u010d': 'c',
  '\u010e': 'D',
  '\u0110': 'D',
  '\u010f': 'd',
  '\u0111': 'd',
  '\u0112': 'E',
  '\u0114': 'E',
  '\u0116': 'E',
  '\u0118': 'E',
  '\u011a': 'E',
  '\u0113': 'e',
  '\u0115': 'e',
  '\u0117': 'e',
  '\u0119': 'e',
  '\u011b': 'e',
  '\u011c': 'G',
  '\u011e': 'G',
  '\u0120': 'G',
  '\u0122': 'G',
  '\u011d': 'g',
  '\u011f': 'g',
  '\u0121': 'g',
  '\u0123': 'g',
  '\u0124': 'H',
  '\u0126': 'H',
  '\u0125': 'h',
  '\u0127': 'h',
  '\u0128': 'I',
  '\u012a': 'I',
  '\u012c': 'I',
  '\u012e': 'I',
  '\u0130': 'I',
  '\u0129': 'i',
  '\u012b': 'i',
  '\u012d': 'i',
  '\u012f': 'i',
  '\u0131': 'i',
  '\u0134': 'J',
  '\u0135': 'j',
  '\u0136': 'K',
  '\u0137': 'k',
  '\u0138': 'k',
  '\u0139': 'L',
  '\u013b': 'L',
  '\u013d': 'L',
  '\u013f': 'L',
  '\u0141': 'L',
  '\u013a': 'l',
  '\u013c': 'l',
  '\u013e': 'l',
  '\u0140': 'l',
  '\u0142': 'l',
  '\u0143': 'N',
  '\u0145': 'N',
  '\u0147': 'N',
  '\u014a': 'N',
  '\u0144': 'n',
  '\u0146': 'n',
  '\u0148': 'n',
  '\u014b': 'n',
  '\u014c': 'O',
  '\u014e': 'O',
  '\u0150': 'O',
  '\u014d': 'o',
  '\u014f': 'o',
  '\u0151': 'o',
  '\u0154': 'R',
  '\u0156': 'R',
  '\u0158': 'R',
  '\u0155': 'r',
  '\u0157': 'r',
  '\u0159': 'r',
  '\u015a': 'S',
  '\u015c': 'S',
  '\u015e': 'S',
  '\u0160': 'S',
  '\u015b': 's',
  '\u015d': 's',
  '\u015f': 's',
  '\u0161': 's',
  '\u0162': 'T',
  '\u0164': 'T',
  '\u0166': 'T',
  '\u0163': 't',
  '\u0165': 't',
  '\u0167': 't',
  '\u0168': 'U',
  '\u016a': 'U',
  '\u016c': 'U',
  '\u016e': 'U',
  '\u0170': 'U',
  '\u0172': 'U',
  '\u0169': 'u',
  '\u016b': 'u',
  '\u016d': 'u',
  '\u016f': 'u',
  '\u0171': 'u',
  '\u0173': 'u',
  '\u0174': 'W',
  '\u0175': 'w',
  '\u0176': 'Y',
  '\u0177': 'y',
  '\u0178': 'Y',
  '\u0179': 'Z',
  '\u017b': 'Z',
  '\u017d': 'Z',
  '\u017a': 'z',
  '\u017c': 'z',
  '\u017e': 'z',
  '\u0132': 'IJ',
  '\u0133': 'ij',
  '\u0152': 'Oe',
  '\u0153': 'oe',
  '\u0149': "'n",
  '\u017f': 's'
};
/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */

var deburrLetter0 = basePropertyOf(deburredLetters);
const deburrLetter = (deburrLetter0);



/** Used to match Latin Unicode letters (excluding mathematical operators). */

var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
/** Used to compose unicode character classes. */

var rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
/** Used to compose unicode capture groups. */

var rsCombo = '[' + rsComboRange + ']';
/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */

var reComboMark = RegExp(rsCombo, 'g');
/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */

function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

const _default = (deburr);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQ3LmpzAZPCrS4vdG9TdHJpbmcuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0O8CRkzvAwo6uYmFzZVByb3BlcnR5T2aboWmQwgLAkgMEwADAp2RlZmF1bHSQqHRvU3RyaW5nm6FpkMIGwJIHCMABwKdkZWZhdWx0kK9kZWJ1cnJlZExldHRlcnOboWyQwgoNkgsMwMDAwJCtZGVidXJyTGV0dGVyMJuhbJKuYmFzZVByb3BlcnR5T2avZGVidXJyZWRMZXR0ZXJzwg8SkhARwMDAwJKuYmFzZVByb3BlcnR5T2avZGVidXJyZWRMZXR0ZXJzrGRlYnVyckxldHRlcpuhbJGtZGVidXJyTGV0dGVyMMIUwJIVFsDAwMCQp3JlTGF0aW6boWyQwhgbkhkawMDAwJCxcnNDb21ib01hcmtzUmFuZ2WboWyQwh3Akh4fwMDAwJC1cmVDb21ib0hhbGZNYXJrc1Jhbmdlm6FskMIgwJIhIsDAwMCQs3JzQ29tYm9TeW1ib2xzUmFuZ2WboWyQwiPAkiQlwMDAwJCscnNDb21ib1Jhbmdlm6Fsk7Fyc0NvbWJvTWFya3NSYW5nZbVyZUNvbWJvSGFsZk1hcmtzUmFuZ2WzcnNDb21ib1N5bWJvbHNSYW5nZcImKZInKMDAwMCTsXJzQ29tYm9NYXJrc1JhbmdltXJlQ29tYm9IYWxmTWFya3NSYW5nZbNyc0NvbWJvU3ltYm9sc1Jhbmdlp3JzQ29tYm+boWyRrHJzQ29tYm9SYW5nZcIrLpIsLcDAwMCRrHJzQ29tYm9SYW5nZatyZUNvbWJvTWFya5uhbJKmUmVnRXhwp3JzQ29tYm/CMDOSMTLAwMDAkadyc0NvbWJvpmRlYnVycpuhbJSodG9TdHJpbmencmVMYXRpbqxkZWJ1cnJMZXR0ZXKrcmVDb21ib01hcmvCNMCSNTbAwMDAkKhfZGVmYXVsdJuhbJGmZGVidXJywjjAkjk6wMDAwJDcADyWAAABwMLDlgAYAgXCwpYJAAPAwsKWCw7AwMLClgAOwAzCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYWCMAawsKWRQEKDsLClgQAC8DCwpYAD8ANwsKWAQ/AwMLClgPNDGrAwMLClszvAQ8TwsKWBAAQwMLClgANwBLCwpYEDcDAwsKWAwEEwMLClgEBFBfCwpYGARXAwsKWAAzAEcLClgIMwDLCwpZUARgcwsKWBAAZwMLClgAHwBvCwpYsB8AWwsKWAy3AwMLCljQBHSrCwpYEFB4gwsKWABHAwMLClgARwCLCwpYGFCEjwsKWABXAwMLClgMVwCXCwpYGFCQmwsKWABPAwMLClgMTwMDCwpYGACfAwsKWAAzAKcLClgYMwMDCwpYDAB/AwsKWMQErL8LClgQALMDCwpYAB8AuwsKWBwfAwMLClgMGKMDCwpbM7QEwNMLClgQAMcDCwpYAC8AzwsKWCgvAwMLClgMGLcDCwpbNAk4INTfCwpYJBsAIwsKWBAbAwMLClgIBODvCwpYGATnAwsKWAAjANsLClgkIwMDCwpYBDjrAwsI=
====catalogjs annotation end====*/