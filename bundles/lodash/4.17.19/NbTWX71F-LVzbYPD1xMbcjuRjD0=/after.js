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
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJShbKVhZnRlcg3An5ehbwAAA8CRCMCZoWQJAALAkQLAwpihaal0b0ludGVnZXKSAgvAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAZAQSQwMIAwsDAl6FvAQAFDJDAmKFnAAEGCJDAwpmhZAQYB8CSBwXAwpihbK9GVU5DX0VSUk9SX1RFWFSSBwrAwMAF2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYWZ0ZXIuanOYoXIAD8DAkQbAwpmhZAFlCcCUCgsJBsDCmKFspWFmdGVykgkOwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2FmdGVyLmpzmKFyCQXACpEIwMKYoXJHD8ALkQbAwpihcg4JwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/