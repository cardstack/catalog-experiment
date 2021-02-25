import { default as createPadding } from "./dist/21.js";
import { default as stringSize } from "./dist/144.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function padEnd(string, length, chars) {
  string = toString0(string);
  length = toInteger(length);
  var strLength = length ? stringSize(string) : 0;
  return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
}
export { padEnd as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMjEuanMDwsCVwq0uL2Rpc3QvMTQ0LmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0laFspnBhZEVuZBnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFprWNyZWF0ZVBhZGRpbmeSAhfAAKdkZWZhdWx0wMDAmKFyCw3AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmqc3RyaW5nU2l6ZZIGFsABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaal0b0ludGVnZXKSChXAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIEMDAkMDCmaFkCQAOEJEOwMKZoWmpdG9TdHJpbmcwkg4UwAOnZGVmYXVsdMDAwJihcgsJwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA/AwJDAwpehbwEAEhiQwJmhZAAnE8CVFBUWFxPAwpmhbKZwYWRFbmSSExrAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhZEVuZC5qc5ihcgkGwBSREsDCmKFyJQnAFZENwMKYoXIVCcAWkQnAwpihciUKwBeRBcDCmKFyPw3AwJEBwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIABsDAkRLAwg==
====catalogjs annotation end====*/