import { default as baseGetTag } from "./dist/86.js";
import { default as getPrototype } from "./dist/137.js";
import { default as isObjectLike } from "./isObjectLike.js";
var objectTag = '[object Object]';
var funcProto = Function.prototype,
    objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }

  var proto = getPrototype(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
export { isPlainObject as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2Rpc3QvMTM3LmpzBsLAlcKxLi9pc09iamVjdExpa2UuanMJwsCBp2RlZmF1bHSUoWytaXNQbGFpbk9iamVjdCrA3AAsl6FvAAADwJEcwJmhZAkAAsCRAsDCmKFpqmJhc2VHZXRUYWeSAiPAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsZ2V0UHJvdG90eXBlkgUlwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGlzT2JqZWN0TGlrZZIIIsACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARwHCpDAwgLCwMCXoW8BAAspkMCYoWcAAQwOkMDCmaFkBBQNwJINC8DCmKFsqW9iamVjdFRhZ5INJMDAwAvZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1BsYWluT2JqZWN0LmpzmKFyAAnAwJEMwMKYoWcBAQ8TkMDCmaFkBBUQEZIQDsDCmKFsqWZ1bmNQcm90b5IQFsDAwA7ZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1BsYWluT2JqZWN0LmpzmKFyAAnAwJEPwMKZoWQGExLAkhIOwMKYoWyrb2JqZWN0UHJvdG+SEhrAwMAO2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNQbGFpbk9iamVjdC5qc5ihcgALwMCREcDCmKFnAQEUF5DAwpmhZAQJFcCUFhUTD8DCmKFsrGZ1bmNUb1N0cmluZ5MVHyfAwMAT2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNQbGFpbk9iamVjdC5qc5ihcgAMwBaRFMDCmKFyAwnAwJEPwMKYoWcBARgbkMDCmaFkBA8ZwJQaGRcRwMKYoWyuaGFzT3duUHJvcGVydHmSGSbAwMAX2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNQbGFpbk9iamVjdC5qc5ihcgAOwBqRGMDCmKFyAwvAwJERwMKYoWcBARwgkMDCmaFkBAAdwJQdGx4UwMKYoWywb2JqZWN0Q3RvclN0cmluZ5IdKMDAwBvZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1BsYWluT2JqZWN0LmpzmKFyABDAHpEcwMKYoWcDDR/AkR/AwpihcgAMwMCRFMDCmaFkAQMhwJwiIyQlJicoIQwYFBzAwpihbK1pc1BsYWluT2JqZWN0kiErwMDAwNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzUGxhaW5PYmplY3QuanOYoXIJDcAikSDAwpihchEMwCORB8DCmKFyCwrAJJEBwMKYoXILCcAlkQzAwpihcikMwCaRBMDCmKFyRQ7AJ5EYwMKYoXJwDMAokRTAwpihcg8QwMCRHMDCmKFnAQMqwJDAwpihZwkLK8CRK8DCmKFyAA3AwJEgwMI=
====catalogjs annotation end====*/