import { default as baseRepeat } from "./169.js";
import { default as baseToString } from "./22.js";
import { default as castSlice } from "./140.js";
import { default as hasUnicode } from "./145.js";
import { default as stringSize } from "./144.js";
import { default as stringToArray } from "./143.js";
var nativeCeil = Math.ceil;
function createPadding(length, chars) {
  chars = chars === undefined ? ' ' : baseToString(chars);
  var charsLength = chars.length;

  if (charsLength < 2) {
    return charsLength ? baseRepeat(chars, length) : chars;
  }

  var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
  return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join('') : result.slice(0, length);
}
export { createPadding as default };
/*====catalogjs annotation start====
k5aVwqguLzE2OS5qcwPCwJXCpy4vMjIuanMHwsCVwqguLzE0MC5qcwvCwJXCqC4vMTQ1LmpzD8LAlcKoLi8xNDQuanMTwsCVwqguLzE0My5qcxfCwIGnZGVmYXVsdJWhbK1jcmVhdGVQYWRkaW5nKMDA3AAql6FvAAADwJDAmaFkCQACBJECwMKZoWmqYmFzZVJlcGVhdJMCICHAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmsYmFzZVRvU3RyaW5nkgYfwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCAnAwJDAwpmhZAkACgyRCsDCmaFpqWNhc3RTbGljZZIKJcACp2RlZmF1bHTAwMCYoXILCcDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgKwMCQwMKZoWQJAA4QkQ7AwpmhaapoYXNVbmljb2Rlkg4kwAOnZGVmYXVsdMDAwJihcgsKwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCArAwJDAwpmhZAkAEhSREsDCmaFpqnN0cmluZ1NpemWSEiPABKdkZWZhdWx0wMDAmKFyCwrAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcICsDAkMDCmaFkCQAWGJEWwMKZoWmtc3RyaW5nVG9BcnJheZIWJsAFp2RlZmF1bHTAwMCYoXILDcDAkRXAwpyhaQEBFRmRGMDCBcLAwJihZwgKwMCQwMKXoW8BABonkMCYoWcAARsdkMDCmaFkBAwcwJIcGsDCmaFsqm5hdGl2ZUNlaWySHCLAwMAakNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVQYWRkaW5nLmpzmKFyAArAwJEbwMKZoWQBOh7Amh8gISIjJCUmHhvAwpmhbK1jcmVhdGVQYWRkaW5nkh4pwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUGFkZGluZy5qc5ihcgkNwB+RHcDCmKFyOAzAIJEFwMKYoXJeCsAhkQHAwpihci0KwCKRAcDCmKFyCArAI5EbwMKYoXIKCsAkkRHAwpihchQKwCWRDcDCmKFyCgnAJpEJwMKYoXIBDcDAkRXAwpihZwEDKMCQwMKYoWcJCynAkSnAwpihcgANwMCRHcDC
====catalogjs annotation end====*/