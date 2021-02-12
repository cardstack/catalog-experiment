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
k5aVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMS5qcwnCwJXCrS4vZGlzdC8xMjIuanMMwsCVwq0uL2Rpc3QvMTQzLmpzD8LAlcKtLi90b1N0cmluZy5qcxLCwIGnZGVmYXVsdJWhbKR0cmltIsDA3AAkl6FvAAADwJDAmaFkCQACwJECwMKZoWmsYmFzZVRvU3RyaW5nkgIbwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaljYXN0U2xpY2WSBSDAAadkZWZhdWx0wMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmaFprWNoYXJzRW5kSW5kZXiSCB/AAqdkZWZhdWx0wMDAmKFyCw3AwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpr2NoYXJzU3RhcnRJbmRleJILHsADp2RlZmF1bHTAwMCYoXILD8DAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmtc3RyaW5nVG9BcnJheZMOHB3ABKdkZWZhdWx0wMDAmKFyCw3AwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmaFpqXRvU3RyaW5nMJIRGcAFp2RlZmF1bHTAwMCYoXILCcDAkRDAwpyhaQEYEBOQwMIFwsDAl6FvAQAUIZDAmKFnAAEVF5DAwpmhZAQPFsCSFhTAwpmhbKZyZVRyaW2SFhrAwMAUkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW0uanOYoXIABsDAkRXAwpmhZAEkGMCaGRobHB0eHyAYFcDCmaFspHRyaW2SGCPAwMDAkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW0uanOYoXIJBMAZkRfAwpihciQJwBqREMDCmKFyVwbAG5EVwMKYoXInDMAckQHAwpihcjcNwB2RDcDCmKFyHQ3AHpENwMKYoXIXD8AfkQrAwpihciYNwCCRB8DCmKFyJwnAwJEEwMKYoWcBAyLAkMDCmKFnCQsjwJEjwMKYoXIABMDAkRfAwg==
====catalogjs annotation end====*/