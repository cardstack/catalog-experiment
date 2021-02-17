import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";
var domExcTag = '[object DOMException]',
    errorTag = '[object Error]';
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }

  var tag = baseGetTag(value);
  return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
}
export { isError as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwfCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwvCwIGnZGVmYXVsdJWhbKdpc0Vycm9yG8DA3AAdl6FvAAADwJDAmaFkCQACBJECwMKZoWmqYmFzZUdldFRhZ5ICFsAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxpc09iamVjdExpa2WSBhXAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIE8DAkMDCmaFkCQAKDJEKwMKZoWmtaXNQbGFpbk9iamVjdJIKGcACp2RlZmF1bHTAwMCYoXILDcDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgUwMCQwMKXoW8BAA4akMCYoWcAAQ8TkMDCmaFkBBoQEZIQDsDCmaFsqWRvbUV4Y1RhZ5IQGMDAwA6Q2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFcnJvci5qc5ihcgAJwMCRD8DCmaFkBhMSwJISDsDCmaFsqGVycm9yVGFnkhIXwMDADpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Vycm9yLmpzmKFyAAjAwJERwMKZoWQBChTAmBUWFxgZFBEPwMKZoWynaXNFcnJvcpIUHMDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFcnJvci5qc5ihcgkHwBWRE8DCmKFyEQzAFpEFwMKYoXIuCsAXkQHAwpihchkIwBiREcDCmKFyCwnAGZEPwMKYoXJKDcDAkQnAwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAHwMCRE8DC
====catalogjs annotation end====*/