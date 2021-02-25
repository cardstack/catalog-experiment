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
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJWhbKZiZWZvcmUOwMDcABCXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaal0b0ludGVnZXKSAgzAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIEMDAkMDCl6FvAQAGDZDAmKFnAAEHCZDAwpmhZAQYCMCSCAbAwpmhbK9GVU5DX0VSUk9SX1RFWFSSCAvAwMAGkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JlZm9yZS5qc5ihcgAPwMCRB8DCmaFkAcysCsCUCwwKB8DCmaFspmJlZm9yZZIKD8DAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmVmb3JlLmpzmKFyCQbAC5EJwMKYoXJWD8AMkQfAwpihcg4JwMCRAcDCmKFnAQMOwJDAwpihZwkLD8CRD8DCmKFyAAbAwJEJwMI=
====catalogjs annotation end====*/