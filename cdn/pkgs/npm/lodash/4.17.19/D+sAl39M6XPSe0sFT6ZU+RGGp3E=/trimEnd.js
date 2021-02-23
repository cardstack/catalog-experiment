import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as charsEndIndex } from "./dist/121.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toString0 } from "./toString.js";
var reTrimEnd = /\s+$/;
function trimEnd(string, chars, guard) {
  string = toString0(string);

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
k5WVwqwuL2Rpc3QvMjIuanMDwsCVwq0uL2Rpc3QvMTQwLmpzB8LAlcKtLi9kaXN0LzEyMS5qcwvCwJXCrS4vZGlzdC8xNDMuanMPwsCVwq0uL3RvU3RyaW5nLmpzE8LAgadkZWZhdWx0laFsp3RyaW1FbmQjwMDcACWXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlVG9TdHJpbmeSAh3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmpY2FzdFNsaWNlkgYhwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFprWNoYXJzRW5kSW5kZXiSCh/AAqdkZWZhdWx0wMDAmKFyCw3AwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcID8DAkMDCmaFkCQAOEJEOwMKZoWmtc3RyaW5nVG9BcnJheZMOHiDAA6dkZWZhdWx0wMDAmKFyCw3AwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcID8DAkMDCmaFkCQASFJESwMKZoWmpdG9TdHJpbmcwkhIbwASnZGVmYXVsdMDAwJihcgsJwMCREcDCnKFpAQERFZEUwMIEwsDAmKFnCA/AwJDAwpehbwEAFiKQwJihZwABFxmQwMKZoWQECRjAkhgWwMKZoWypcmVUcmltRW5kkhgcwMDAFpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90cmltRW5kLmpzmKFyAAnAwJEXwMKZoWQBIBrAmRscHR4fICEaF8DCmaFsp3RyaW1FbmSSGiTAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RyaW1FbmQuanOYoXIJB8AbkRnAwpihciQJwByREcDCmKFyVwnAHZEXwMKYoXInDMAekQHAwpihcjcNwB+RDcDCmKFyFg3AIJEJwMKYoXINDcAhkQ3AwpihchcJwMCRBcDCmKFnAQMjwJDAwpihZwkLJMCRJMDCmKFyAAfAwJEZwMI=
====catalogjs annotation end====*/