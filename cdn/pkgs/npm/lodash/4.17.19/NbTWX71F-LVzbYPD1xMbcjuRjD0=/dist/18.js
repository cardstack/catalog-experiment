import { default as castSlice } from "./140.js";
import { default as hasUnicode } from "./145.js";
import { default as stringToArray } from "./143.js";
import { default as toString0 } from "../toString.js";
function createCaseFirst(methodName) {
  return function (string) {
    string = toString0(string);
    var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
    var chr = strSymbols ? strSymbols[0] : string.charAt(0);
    var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
    return chr[methodName]() + trailing;
  };
}
export { createCaseFirst as default };
/*====catalogjs annotation start====
k5SVwqguLzE0MC5qcwPCwJXCqC4vMTQ1LmpzBsLAlcKoLi8xNDMuanMJwsCVwq4uLi90b1N0cmluZy5qcwzCwIGnZGVmYXVsdJWhbK9jcmVhdGVDYXNlRmlyc3QVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaljYXN0U2xpY2WSAhPAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmhhc1VuaWNvZGWSBRHAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFprXN0cmluZ1RvQXJyYXmSCBLAAqdkZWZhdWx0wMDAmKFyCw3AwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqXRvU3RyaW5nMJILEMADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQEZCg2QwMIDwsDAl6FvAQAOFJDAmaFkAFsPwJUQERITD8DCmaFsr2NyZWF0ZUNhc2VGaXJzdJIPFsDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUNhc2VGaXJzdC5qc5ihcgkPwBCRDsDCmKFyOQnAEZEKwMKYoXIfCsASkQTAwpihcgsNwBORB8DCmKFycwnAwJEBwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIAD8DAkQ7Awg==
====catalogjs annotation end====*/