import { default as coreJsData } from "./88.js";
import { default as isFunction } from "../isFunction.js";
import { default as isObject } from "../isObject.js";
import { default as toSource } from "./109.js";
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype,
    objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty0).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }

  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
export { baseIsNative as default };
/*====catalogjs annotation start====
k5SVwqcuLzg4LmpzA8LAlcKwLi4vaXNGdW5jdGlvbi5qcwfCwJXCri4uL2lzT2JqZWN0LmpzC8LAlcKoLi8xMDkuanMPwsCBp2RlZmF1bHSVoWysYmFzZUlzTmF0aXZlQcDA3ABDl6FvAAADwJITMsCZoWQJAAIEkQLAwpmhaapjb3JlSnNEYXRhlAIWFxjAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmqaXNGdW5jdGlvbpIGPMABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgSwMCQwMKZoWQJAAoMkQrAwpmhaahpc09iamVjdJIKOsACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgQwMCQwMKZoWQJAA4QkQ7Awpmhaah0b1NvdXJjZZIOP8ADp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgKwMCQwMKXoW8BABIdkMCYoWcAARMZkMDCmaFkBAAUwJMUEhXAwpmhbKptYXNrU3JjS2V5kxQbHMDAwBKQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzTWFza2VkLmpzmKFyAArAFZETwMKYoWcDRhbAkxYXGMDCmKFyKArAF5EBwMKYoXIECsAYkQHAwpihcgkKwMCRAcDCmaFkAQsawJQbHBoTwMKZoWyoaXNNYXNrZWSSGjvAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc01hc2tlZC5qc5ihcgkIwBuRGcDCmKFyFArAHJETwMKYoXIECsDAkRPAwpehbwEAHkCQwJihZwABHyGQwMKZoWQEGCDAkiAewMKZoWyscmVSZWdFeHBDaGFykiA3wMDAHpDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzTmF0aXZlLmpzmKFyAAzAwJEfwMKYoWcBASIkkMDCmaFkBCAjwJIjIcDCmaFsrHJlSXNIb3N0Q3RvcpIjPsDAwCGQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc05hdGl2ZS5qc5ihcgAMwMCRIsDCmKFnAQElKZDAwpmhZAQVJieSJiTAwpmhbKlmdW5jUHJvdG+SJizAwMAkkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNOYXRpdmUuanOYoXIACcDAkSXAwpmhZAYTKMCSKCTAwpmhbKtvYmplY3RQcm90b5IoMMDAwCSQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc05hdGl2ZS5qc5ihcgALwMCRJ8DCmKFnAQEqLZDAwpmhZAQJK8CULCspJcDCmaFsrGZ1bmNUb1N0cmluZ5IrNcDAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc05hdGl2ZS5qc5ihcgAMwCyRKsDCmKFyAwnAwJElwMKYoWcBAS4xkMDCmaFkBA8vwJQwLy0nwMKZoWyvaGFzT3duUHJvcGVydHkwki82wMDALZDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzTmF0aXZlLmpzmKFyAA/AMJEuwMKYoXIDC8DAkSfAwpihZwEBMjiQwMKZoWQEADPAljMxNCouH8DCmaFsqnJlSXNOYXRpdmWSMz3AwMAxkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNOYXRpdmUuanOYoXIACsA0kTLAwpihZwNbNcCTNTY3wMKYoXINDMA2kSrAwpihcgYPwDeRLsDCmKFyCgzAwJEfwMKZoWQBCznAmTo7PD0+PzkyIsDCmaFsrGJhc2VJc05hdGl2ZZI5QsDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc05hdGl2ZS5qc5ihcgkMwDqROMDCmKFyEQjAO5EJwMKYoXILCMA8kRnAwpihcjIKwD2RBcDCmKFyCgrAPpEywMKYoXIDDMA/kSLAwpihchgIwMCRDcDCmKFnAQNBwJDAwpihZwkLQsCRQsDCmKFyAAzAwJE4wMI=
====catalogjs annotation end====*/