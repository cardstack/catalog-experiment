import { default as freeGlobal } from "./95.js";
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal.process;
var nodeUtil = function () {
  try {
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();
export { nodeUtil as default };
/*====catalogjs annotation start====
k5GVwqcuLzk1LmpzA8LAgadkZWZhdWx0laFsqG5vZGVVdGlsIsDA3AAkl6FvAAADwJEYwJmhZAkAAsCRAsDCmaFpqmZyZWVHbG9iYWySAhbAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEgEEkMDCAMLAwJehbwEABSGQwJihZwABBgiQwMKZoWQESAfAkgcFwMKZoWyrZnJlZUV4cG9ydHOTBwsRwMDABZDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbm9kZVV0aWwuanOYoXIAC8DAkQbAwpihZwEBCQyQwMKZoWQERQrAlAsKCAbAwpmhbKpmcmVlTW9kdWxllgoPEBscHcDAwAiQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX25vZGVVdGlsLmpzmKFyAArAC5EJwMKYoXIDC8DAkQbAwpihZwEBDRKQwMKZoWQEAA7Alw8QEQ4MCQbAwpmhbK1tb2R1bGVFeHBvcnRzkg4VwMDADJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fbm9kZVV0aWwuanOYoXIADcAPkQ3AwpihcgMKwBCRCcDCmKFyBArAEZEJwMKYoXINC8DAkQbAwpihZwEBExeQwMKZoWQECBTAlRUWFBINwMKZoWyrZnJlZVByb2Nlc3OUFB4fIMDAwBKQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX25vZGVVdGlsLmpzmKFyAAvAFZETwMKYoXIDDcAWkQ3AwpihcgQKwMCRAcDCmKFnAQEYwJDAwpmhZAQAGcCVGRcaCRPAwpmhbKhub2RlVXRpbJIZI8DAwBeQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX25vZGVVdGlsLmpzmKFyAAjAGpEYwMKYoWcDJhvAlhscHR4fIMDCmKFyJgrAHJEJwMKYoXIECsAdkQnAwpihcgwKwB6RCcDCmKFyUAvAH5ETwMKYoXIEC8AgkRPAwpihcgwLwMCRE8DCmKFnAQMiwJDAwpihZwkLI8CRI8DCmKFyAAjAwJEYwMI=
====catalogjs annotation end====*/