import { default as constant } from "../constant.js";
import { default as defineProperty } from "./57.js";
import { default as identity } from "../identity.js";
import { default as shortOut } from "./118.js";
var baseSetToString = !defineProperty ? identity : function (func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};
var setToString = shortOut(baseSetToString);
export { setToString as default };
/*====catalogjs annotation start====
k5SVwq4uLi9jb25zdGFudC5qcwPCwJXCpy4vNTcuanMGwsCVwq4uLi9pZGVudGl0eS5qcwnCwJXCqC4vMTE4LmpzDMLAgadkZWZhdWx0laFsq3NldFRvU3RyaW5nHcDA3AAfl6FvAAADwJEXwJmhZAkAAsCRAsDCmaFpqGNvbnN0YW50kgIUwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABkBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa5kZWZpbmVQcm9wZXJ0eZMFERPAAadkZWZhdWx0wMDAmKFyCw7AwJEEwMKcoWkBEgQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGlkZW50aXR5kggSwAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaahzaG9ydE91dJILGsADp2RlZmF1bHTAwMCYoXILCMDAkQrAwpyhaQETCg2QwMIDwsDAl6FvAQAOFZDAmKFnAAEPwJDAwpmhZAQmEMCWERITFBAOwMKZoWyvYmFzZVNldFRvU3RyaW5nkhAbwMDADpDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNldFRvU3RyaW5nLmpzmKFyAA/AEZEPwMKYoXIEDsASkQTAwpihcgMIwBORB8DCmKFyJg7AFJEEwMKYoXJVCMDAkQHAwpehbwEAFhyQwJihZwABF8CQwMKZoWQEABjAkxgWGcDCmaFsq3NldFRvU3RyaW5nkhgewMDAFpDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2V0VG9TdHJpbmcuanOYoXIAC8AZkRfAwpihZwMBGsCSGhvAwpihcgAIwBuRCsDCmKFyAQ/AwJEPwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIAC8DAkRfAwg==
====catalogjs annotation end====*/