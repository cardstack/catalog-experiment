import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as charsStartIndex } from "./dist/122.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var reTrim = /^\s+|\s+$/g;
function trim(string, chars, guard) {
  string = toString(string);

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
k5aVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMS5qcwnCwJXCrS4vZGlzdC8xMjIuanMMwsCVwq0uL2Rpc3QvMTQzLmpzD8LAlcKtLi90b1N0cmluZy5qcxLCwIGnZGVmYXVsdJShbKR0cmltIsDcACSXoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlVG9TdHJpbmeSAhvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpY2FzdFNsaWNlkgUgwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprWNoYXJzRW5kSW5kZXiSCB/AAqdkZWZhdWx0wMCYoXILDcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmvY2hhcnNTdGFydEluZGV4kgsewAOnZGVmYXVsdMDAmKFyCw/AwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmKFprXN0cmluZ1RvQXJyYXmTDhwdwASnZGVmYXVsdMDAmKFyCw3AwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmKFpqHRvU3RyaW5nkhEZwAWnZGVmYXVsdMDAmKFyCwjAwJEQwMKcoWkBGBATkMDCBcLAwJehbwEAFCGQwJihZwABFReQwMKZoWQEDxbAkhYUwMKYoWymcmVUcmltkhYawMDAFNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW0uanOYoXIABsDAkRXAwpmhZAEkGMCaGRobHB0eHyAYFcDCmKFspHRyaW2SGCPAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdHJpbS5qc5ihcgkEwBmRF8DCmKFyJAjAGpEQwMKYoXJXBsAbkRXAwpihcicMwByRAcDCmKFyNw3AHZENwMKYoXIdDcAekQ3AwpihchcPwB+RCsDCmKFyJg3AIJEHwMKYoXInCcDAkQTAwpihZwEDIsCQwMKYoWcJCyPAkSPAwpihcgAEwMCRF8DC
====catalogjs annotation end====*/