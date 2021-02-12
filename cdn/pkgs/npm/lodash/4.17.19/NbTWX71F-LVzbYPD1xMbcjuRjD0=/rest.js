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
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3RvSW50ZWdlci5qcwbCwIGnZGVmYXVsdJWhbKRyZXN0EcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmoYmFzZVJlc3SSAg/AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqXRvSW50ZWdlcpIFDsABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIEJDAmKFnAAEJC5DAwpmhZAQYCsCSCgjAwpmhbK9GVU5DX0VSUk9SX1RFWFSSCg3AwMAIkNlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Jlc3QuanOYoXIAD8DAkQnAwpmhZAEQDMCVDQ4PDAnAwpmhbKRyZXN0kgwSwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXN0LmpzmKFyCQTADZELwMKYoXJLD8AOkQnAwpihcjAJwA+RBMDCmKFyEgjAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABMDAkQvAwg==
====catalogjs annotation end====*/