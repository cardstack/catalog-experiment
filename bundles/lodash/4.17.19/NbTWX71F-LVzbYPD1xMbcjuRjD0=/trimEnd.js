import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString } from "./toString.js";
var reTrimEnd = /\s+$/;
function trimEnd(string, chars, guard) {
  string = toString(string);

  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }

  if (!string || !(chars = baseToString(chars))) {
    return string;
  }

  var strSymbols = stringToArray(string),
      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
  return castSlice(strSymbols, 0, end).join('');
}
export { trimEnd as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzBsLAlcKtLi9kaXN0LzEyMS5qcwnCwJXCrS4vZGlzdC8xNDMuanMMwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0lKFsp3RyaW1FbmQewNwAIJehbwAAA8CRFMCZoWQJAALAkQLAwpihaaxiYXNlVG9TdHJpbmeSAhjAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpY2FzdFNsaWNlkgUcwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprWNoYXJzRW5kSW5kZXiSCBrAAqdkZWZhdWx0wMCYoXILDcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmtc3RyaW5nVG9BcnJheZMLGRvAA6dkZWZhdWx0wMCYoXILDcDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmodG9TdHJpbmeSDhbABKdkZWZhdWx0wMCYoXILCMDAkQ3AwpyhaQEYDRCQwMIEwsDAl6FvAQARHZDAmKFnAAESFJDAwpmhZAQJE8CSExHAwpihbKlyZVRyaW1FbmSSExfAwMAR2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdHJpbUVuZC5qc5ihcgAJwMCREsDCmaFkASAVwJkWFxgZGhscFRLAwpihbKd0cmltRW5kkhUfwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW1FbmQuanOYoXIJB8AWkRTAwpihciQIwBeRDcDCmKFyVwnAGJESwMKYoXInDMAZkQHAwpihcjcNwBqRCsDCmKFyFg3AG5EHwMKYoXINDcAckQrAwpihchcJwMCRBMDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAfAwJEUwMI=
====catalogjs annotation end====*/