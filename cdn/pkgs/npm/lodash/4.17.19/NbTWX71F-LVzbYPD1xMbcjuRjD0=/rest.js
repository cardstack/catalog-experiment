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
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3RvSW50ZWdlci5qcwfCwIGnZGVmYXVsdJWhbKRyZXN0E8DA3AAVl6FvAAADwJDAmaFkCQACBJECwMKZoWmoYmFzZVJlc3SSAhHAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmpdG9JbnRlZ2VykgYQwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCBDAwJDAwpehbwEAChKQwJihZwABCw2QwMKZoWQEGAzAkgwKwMKZoWyvRlVOQ19FUlJPUl9URVhUkgwPwMDACpDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXN0LmpzmKFyAA/AwJELwMKZoWQBEA7AlQ8QEQ4LwMKZoWykcmVzdJIOFMDAwMCQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVzdC5qc5ihcgkEwA+RDcDCmKFySw/AEJELwMKYoXIwCcARkQXAwpihchIIwMCRAcDCmKFnAQMTwJDAwpihZwkLFMCRFMDCmKFyAATAwJENwMI=
====catalogjs annotation end====*/