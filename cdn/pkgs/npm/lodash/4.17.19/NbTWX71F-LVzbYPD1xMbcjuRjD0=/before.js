import { default as toInteger } from "./toInteger.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function before(n, func) {
  var result;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  n = toInteger(n);
  return function () {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }

    if (n <= 1) {
      func = undefined;
    }

    return result;
  };
}
export { before as default };
/*====catalogjs annotation start====
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJWhbKZiZWZvcmUNwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmpdG9JbnRlZ2VykgILwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABkBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYIkMDCmaFkBBgHwJIHBcDCmaFsr0ZVTkNfRVJST1JfVEVYVJIHCsDAwAWQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmVmb3JlLmpzmKFyAA/AwJEGwMKZoWQBzKwJwJQKCwkGwMKZoWymYmVmb3JlkgkOwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iZWZvcmUuanOYoXIJBsAKkQjAwpihclYPwAuRBsDCmKFyDgnAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/