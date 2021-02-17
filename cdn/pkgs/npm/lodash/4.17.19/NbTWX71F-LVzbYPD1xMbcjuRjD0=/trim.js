import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString0 } from "./toString.js";
var reTrim = /^\s+|\s+$/g;
function trim(string, chars, guard) {
  string = toString0(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;
  return castSlice(strSymbols, start, end).join('');
}
export { trim as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzB8LAlcKtLi9kaXN0LzEyMS5qcwvCwJXCrS4vZGlzdC8xMjIuanMPwsCVwq0uL2Rpc3QvMTQzLmpzE8LAlcKtLi90b1N0cmluZy5qcxfCwIGnZGVmYXVsdJWhbKR0cmltKMDA3AAql6FvAAADwJDAmaFkCQACBJECwMKZoWmsYmFzZVRvU3RyaW5nkgIhwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqWNhc3RTbGljZZIGJsABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaa1jaGFyc0VuZEluZGV4kgolwAKnZGVmYXVsdMDAwJihcgsNwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpr2NoYXJzU3RhcnRJbmRleJIOJMADp2RlZmF1bHTAwMCYoXILD8DAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgPwMCQwMKZoWQJABIUkRLAwpmhaa1zdHJpbmdUb0FycmF5kxIiI8AEp2RlZmF1bHTAwMCYoXILDcDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgPwMCQwMKZoWQJABYYkRbAwpmhaal0b1N0cmluZzCSFh/ABadkZWZhdWx0wMDAmKFyCwnAwJEVwMKcoWkBARUZkRjAwgXCwMCYoWcID8DAkMDCl6FvAQAaJ5DAmKFnAAEbHZDAwpmhZAQPHMCSHBrAwpmhbKZyZVRyaW2SHCDAwMAakNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW0uanOYoXIABsDAkRvAwpmhZAEkHsCaHyAhIiMkJSYeG8DCmaFspHRyaW2SHinAwMDAkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW0uanOYoXIJBMAfkR3AwpihciQJwCCRFcDCmKFyVwbAIZEbwMKYoXInDMAikQHAwpihcjcNwCOREcDCmKFyHQ3AJJERwMKYoXIXD8AlkQ3AwpihciYNwCaRCcDCmKFyJwnAwJEFwMKYoWcBAyjAkMDCmKFnCQspwJEpwMKYoXIABMDAkR3Awg==
====catalogjs annotation end====*/