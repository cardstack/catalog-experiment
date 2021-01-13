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
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJShbKZiZWZvcmUNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmpdG9JbnRlZ2VykgILwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGQEEkMDCAMLAwJehbwEABQyQwJihZwABBgiQwMKZoWQEGAfAkgcFwMKYoWyvRlVOQ19FUlJPUl9URVhUkgcKwMDABdlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JlZm9yZS5qc5ihcgAPwMCRBsDCmaFkAcysCcCUCgsJBsDCmKFspmJlZm9yZZIJDsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iZWZvcmUuanOYoXIJBsAKkQjAwpihclYPwAuRBsDCmKFyDgnAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/