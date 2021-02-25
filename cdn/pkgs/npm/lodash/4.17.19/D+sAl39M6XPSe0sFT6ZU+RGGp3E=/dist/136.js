import { default as arrayPush } from "./139.js";
import { default as getPrototype } from "./137.js";
import { default as getSymbols } from "./149.js";
import { default as stubArray } from "../stubArray.js";
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
  var result = [];

  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }

  return result;
};
export { getSymbolsIn as default };
/*====catalogjs annotation start====
k5SVwqguLzEzOS5qcwPCwJXCqC4vMTM3LmpzB8LAlcKoLi8xNDkuanMLwsCVwq8uLi9zdHViQXJyYXkuanMPwsCBp2RlZmF1bHSVoWysZ2V0U3ltYm9sc0luHsDA3AAgl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYXJyYXlQdXNokgIawACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFprGdldFByb3RvdHlwZZIGHMABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaapnZXRTeW1ib2xzkgobwAKnZGVmYXVsdMDAwJihcgsKwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCArAwJDAwpmhZAkADhCRDsDCmaFpqXN0dWJBcnJheZIOGcADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgRwMCQwMKXoW8BABIdkMCYoWcAARMVkMDCmaFkBB8UwJIUEsDCmaFssG5hdGl2ZUdldFN5bWJvbHOSFBjAwMASkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRTeW1ib2xzSW4uanOYoXIAEMDAkRPAwpihZwEBFsCQwMKZoWQEIRfAmBgZGhscFxUTwMKZoWysZ2V0U3ltYm9sc0lukhcfwMDAFZDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0U3ltYm9sc0luLmpzmKFyAAzAGJEWwMKYoXIEEMAZkRPAwpihcgMJwBqRDcDCmKFyQgnAG5EBwMKYoXIJCsAckQnAwpihchgMwMCRBcDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAzAwJEWwMI=
====catalogjs annotation end====*/