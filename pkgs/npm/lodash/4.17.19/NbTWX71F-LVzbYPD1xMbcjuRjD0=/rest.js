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
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3RvSW50ZWdlci5qcwbCwIGnZGVmYXVsdJShbKRyZXN0EcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaahiYXNlUmVzdJICD8AAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaal0b0ludGVnZXKSBQ7AAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQYCsCSCgjAwpihbK9GVU5DX0VSUk9SX1RFWFSSCg3AwMAI2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVzdC5qc5ihcgAPwMCRCcDCmaFkARAMwJUNDg8MCcDCmKFspHJlc3SSDBLAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVzdC5qc5ihcgkEwA2RC8DCmKFySw/ADpEJwMKYoXIwCcAPkQTAwpihchIIwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAATAwJELwMI=
====catalogjs annotation end====*/