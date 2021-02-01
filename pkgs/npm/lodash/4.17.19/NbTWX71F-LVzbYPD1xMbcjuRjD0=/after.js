import { default as toInteger } from "./toInteger.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  n = toInteger(n);
  return function () {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}
export { after as default };
/*====catalogjs annotation start====
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJShbKVhZnRlcg3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqXRvSW50ZWdlcpICC8AAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABkBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYIkMDCmaFkBBgHwJIHBcDCmKFsr0ZVTkNfRVJST1JfVEVYVJIHCsDAwAXZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hZnRlci5qc5ihcgAPwMCRBsDCmaFkAWUJwJQKCwkGwMKYoWylYWZ0ZXKSCQ7AwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYWZ0ZXIuanOYoXIJBcAKkQjAwpihckcPwAuRBsDCmKFyDgnAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABcDAkQjAwg==
====catalogjs annotation end====*/