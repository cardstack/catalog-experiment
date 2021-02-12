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
k5SVwqcuLzg4LmpzA8LAlcKwLi4vaXNGdW5jdGlvbi5qcwbCwJXCri4uL2lzT2JqZWN0LmpzCcLAlcKoLi8xMDkuanMMwsCBp2RlZmF1bHSVoWysYmFzZUlzTmF0aXZlPcDA3AA/l6FvAAADwJIPLsCZoWQJAALAkQLAwpmhaapjb3JlSnNEYXRhlAISExTAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmlzRnVuY3Rpb26SBTjAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBGwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqGlzT2JqZWN0kgg2wAKnZGVmYXVsdMDAwJihcgsIwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaah0b1NvdXJjZZILO8ADp2RlZmF1bHTAwMCYoXILCMDAkQrAwpyhaQETCg2QwMIDwsDAl6FvAQAOGZDAmKFnAAEPFZDAwpmhZAQAEMCTEA4RwMKZoWyqbWFza1NyY0tleZMQFxjAwMAOkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc01hc2tlZC5qc5ihcgAKwBGRD8DCmKFnA0YSwJMSExTAwpihcigKwBORAcDCmKFyBArAFJEBwMKYoXIJCsDAkQHAwpmhZAELFsCUFxgWD8DCmaFsqGlzTWFza2VkkhY3wMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNNYXNrZWQuanOYoXIJCMAXkRXAwpihchQKwBiRD8DCmKFyBArAwJEPwMKXoW8BABo8kMCYoWcAARsdkMDCmaFkBBgcwJIcGsDCmaFsrHJlUmVnRXhwQ2hhcpIcM8DAwBqQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc05hdGl2ZS5qc5ihcgAMwMCRG8DCmKFnAQEeIJDAwpmhZAQgH8CSHx3AwpmhbKxyZUlzSG9zdEN0b3KSHzrAwMAdkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNOYXRpdmUuanOYoXIADMDAkR7AwpihZwEBISWQwMKZoWQEFSIjkiIgwMKZoWypZnVuY1Byb3RvkiIowMDAIJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzTmF0aXZlLmpzmKFyAAnAwJEhwMKZoWQGEyTAkiQgwMKZoWyrb2JqZWN0UHJvdG+SJCzAwMAgkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNOYXRpdmUuanOYoXIAC8DAkSPAwpihZwEBJimQwMKZoWQECSfAlCgnJSHAwpmhbKxmdW5jVG9TdHJpbmeSJzHAwMAlkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNOYXRpdmUuanOYoXIADMAokSbAwpihcgMJwMCRIcDCmKFnAQEqLZDAwpmhZAQPK8CULCspI8DCmaFsr2hhc093blByb3BlcnR5MJIrMsDAwCmQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc05hdGl2ZS5qc5ihcgAPwCyRKsDCmKFyAwvAwJEjwMKYoWcBAS40kMDCmaFkBAAvwJYvLTAmKhvAwpmhbKpyZUlzTmF0aXZlki85wMDALZDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzTmF0aXZlLmpzmKFyAArAMJEuwMKYoWcDWzHAkzEyM8DCmKFyDQzAMpEmwMKYoXIGD8AzkSrAwpihcgoMwMCRG8DCmaFkAQs1wJk2Nzg5Ojs1Lh7AwpmhbKxiYXNlSXNOYXRpdmWSNT7AwMDAkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNOYXRpdmUuanOYoXIJDMA2kTTAwpihchEIwDeRB8DCmKFyCwjAOJEVwMKYoXIyCsA5kQTAwpihcgoKwDqRLsDCmKFyAwzAO5EewMKYoXIYCMDAkQrAwpihZwEDPcCQwMKYoWcJCz7AkT7AwpihcgAMwMCRNMDC
====catalogjs annotation end====*/