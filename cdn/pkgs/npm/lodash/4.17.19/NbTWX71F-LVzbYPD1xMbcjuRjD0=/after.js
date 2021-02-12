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
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJWhbKVhZnRlcg3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaal0b0ludGVnZXKSAgvAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAGQEEkMDCAMLAwJehbwEABQyQwJihZwABBgiQwMKZoWQEGAfAkgcFwMKZoWyvRlVOQ19FUlJPUl9URVhUkgcKwMDABZDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9hZnRlci5qc5ihcgAPwMCRBsDCmaFkAWUJwJQKCwkGwMKZoWylYWZ0ZXKSCQ7AwMDAkNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2FmdGVyLmpzmKFyCQXACpEIwMKYoXJHD8ALkQbAwpihcg4JwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/