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
k5OVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwnCwIGnZGVmYXVsdJShbKdpc0Vycm9yGMDcABqXoW8AAAPAkRDAmaFkCQACwJECwMKYoWmqYmFzZUdldFRhZ5ICE8AAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxpc09iamVjdExpa2WSBRLAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEcBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmtaXNQbGFpbk9iamVjdJIIFsACp2RlZmF1bHTAwJihcgsNwMCRB8DCnKFpAR0HCpDAwgLCwMCXoW8BAAsXkMCYoWcAAQwQkMDCmaFkBBoNDpINC8DCmKFsqWRvbUV4Y1RhZ5INFcDAwAvZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Vycm9yLmpzmKFyAAnAwJEMwMKZoWQGEw/Akg8LwMKYoWyoZXJyb3JUYWeSDxTAwMAL2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFcnJvci5qc5ihcgAIwMCRDsDCmaFkAQoRwJgSExQVFhEODMDCmKFsp2lzRXJyb3KSERnAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFcnJvci5qc5ihcgkHwBKREMDCmKFyEQzAE5EEwMKYoXIuCsAUkQHAwpihchkIwBWRDsDCmKFyCwnAFpEMwMKYoXJKDcDAkQfAwpihZwEDGMCQwMKYoWcJCxnAkRnAwpihcgAHwMCREMDC
====catalogjs annotation end====*/