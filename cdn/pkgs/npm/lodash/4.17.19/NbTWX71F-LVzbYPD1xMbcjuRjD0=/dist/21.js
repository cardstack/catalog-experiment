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
k5aVwqguLzE2OS5qcwPCwJXCpy4vMjIuanMGwsCVwqguLzE0MC5qcwnCwJXCqC4vMTQ1LmpzDMLAlcKoLi8xNDQuanMPwsCVwqguLzE0My5qcxLCwIGnZGVmYXVsdJWhbK1jcmVhdGVQYWRkaW5nIsDA3AAkl6FvAAADwJDAmaFkCQACwJECwMKZoWmqYmFzZVJlcGVhdJMCGhvAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGJhc2VUb1N0cmluZ5IFGcABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQESBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmpY2FzdFNsaWNlkggfwAKnZGVmYXVsdMDAwJihcgsJwMCRB8DCnKFpARMHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaapoYXNVbmljb2RlkgsewAOnZGVmYXVsdMDAwJihcgsKwMCRCsDCnKFpARMKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhaapzdHJpbmdTaXplkg4dwASnZGVmYXVsdMDAwJihcgsKwMCRDcDCnKFpARMNEpDAwgTCwMCZoWQJABHAkRHAwpmhaa1zdHJpbmdUb0FycmF5khEgwAWnZGVmYXVsdMDAwJihcgsNwMCREMDCnKFpARMQE5DAwgXCwMCXoW8BABQhkMCYoWcAARUXkMDCmaFkBAwWwJIWFMDCmaFsqm5hdGl2ZUNlaWySFhzAwMAUkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVQYWRkaW5nLmpzmKFyAArAwJEVwMKZoWQBOhjAmhkaGxwdHh8gGBXAwpmhbK1jcmVhdGVQYWRkaW5nkhgjwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3JlYXRlUGFkZGluZy5qc5ihcgkNwBmRF8DCmKFyOAzAGpEEwMKYoXJeCsAbkQHAwpihci0KwByRAcDCmKFyCArAHZEVwMKYoXIKCsAekQ3AwpihchQKwB+RCsDCmKFyCgnAIJEHwMKYoXIBDcDAkRDAwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgANwMCRF8DC
====catalogjs annotation end====*/