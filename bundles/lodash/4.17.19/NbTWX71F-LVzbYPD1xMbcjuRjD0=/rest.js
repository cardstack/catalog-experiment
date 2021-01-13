import { default as baseRest } from "./dist/49.js";
import { default as toInteger } from "./toInteger.js";
var FUNC_ERROR_TEXT = 'Expected a function';
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  start = start === undefined ? start : toInteger(start);
  return baseRest(func, start);
}
export { rest as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3RvSW50ZWdlci5qcwbCwIGnZGVmYXVsdJShbKRyZXN0EcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmoYmFzZVJlc3SSAg/AAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpdG9JbnRlZ2VykgUOwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGQQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQEGArAkgoIwMKYoWyvRlVOQ19FUlJPUl9URVhUkgoNwMDACNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Jlc3QuanOYoXIAD8DAkQnAwpmhZAEQDMCVDQ4PDAnAwpihbKRyZXN0kgwSwMDAwNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Jlc3QuanOYoXIJBMANkQvAwpihcksPwA6RCcDCmKFyMAnAD5EEwMKYoXISCMDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAEwMCRC8DC
====catalogjs annotation end====*/