import { default as baseFindIndex } from "./dist/124.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as toInteger } from "./toInteger.js";
var nativeMax = Math.max,
    nativeMin = Math.min;
function findLastIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return -1;
  }

  var index = length - 1;

  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }

  return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}
export { findLastIndex as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI0LmpzA8LAlcKrLi9kaXN0LzYuanMGwsCVwq4uL3RvSW50ZWdlci5qcwnCwIGnZGVmYXVsdJShbK1maW5kTGFzdEluZGV4GMDcABqXoW8AAAPAkRDAmaFkCQACwJECwMKYoWmtYmFzZUZpbmRJbmRleJICFcAAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlSXRlcmF0ZWWSBRbAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpdG9JbnRlZ2VykggSwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcKkMDCAsLAwJehbwEACxeQwJihZwABDBCQwMKZoWQECw0Okg0LwMKYoWypbmF0aXZlTWF4kg0TwMDAC9lNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZpbmRMYXN0SW5kZXguanOYoXIACcDAkQzAwpmhZAYLD8CSDwvAwpihbKluYXRpdmVNaW6SDxTAwMAL2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmluZExhc3RJbmRleC5qc5ihcgAJwMCRDsDCmaFkAR8RwJgSExQVFhEMDsDCmKFsrWZpbmRMYXN0SW5kZXiSERnAwMDA2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZmluZExhc3RJbmRleC5qc5ihcgkNwBKREMDCmKFyzL8JwBORB8DCmKFyKQnAFJEMwMKYoXIWCcAVkQ7AwpihciMNwBaRAcDCmKFyCAzAwJEEwMKYoWcBAxjAkMDCmKFnCQsZwJEZwMKYoXIADcDAkRDAwg==
====catalogjs annotation end====*/