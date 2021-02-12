import { default as arrayMap } from "./dist/98.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
import { default as isSymbol } from "./isSymbol.js";
import { default as stringToPath } from "./dist/58.js";
import { default as toKey } from "./dist/27.js";
import { default as toString0 } from "./toString.js";
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }

  return isSymbol(value) ? [value] : copyArray(stringToPath(toString0(value)));
}
export { toPath as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvOTguanMDwsCVwq0uL2Rpc3QvMTE3LmpzBsLAlcKsLi9pc0FycmF5LmpzCcLAlcKtLi9pc1N5bWJvbC5qcwzCwJXCrC4vZGlzdC81OC5qcw/CwJXCrC4vZGlzdC8yNy5qcxLCwJXCrS4vdG9TdHJpbmcuanMVwsCBp2RlZmF1bHSVoWymdG9QYXRoIcDA3AAjl6FvAAADwJDAmaFkCQACwJECwMKZoWmoYXJyYXlNYXCSAhrAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqWNvcHlBcnJheZIFHcABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmnaXNBcnJheZIIGcACp2RlZmF1bHTAwMCYoXILB8DAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmoaXNTeW1ib2ySCxzAA6dkZWZhdWx0wMDAmKFyCwjAwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmaFprHN0cmluZ1RvUGF0aJIOHsAEp2RlZmF1bHTAwMCYoXILDMDAkQ3AwpyhaQEXDRKQwMIEwsDAmaFkCQARwJERwMKZoWmldG9LZXmSERvABadkZWZhdWx0wMDAmKFyCwXAwJEQwMKcoWkBFxAVkMDCBcLAwJmhZAkAFMCRFMDCmaFpqXRvU3RyaW5nMJIUH8AGp2RlZmF1bHTAwMCYoXILCcDAkRPAwpyhaQEYExaQwMIGwsDAl6FvAQAXIJDAmaFkAAwYwJgZGhscHR4fGMDCmaFspnRvUGF0aJIYIsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9QYXRoLmpzmKFyCQbAGZEXwMKYoXIQB8AakQfAwpihchYIwBuRAcDCmKFyCAXAHJEQwMKYoXIRCMAdkQrAwpihchQJwB6RBMDCmKFyAQzAH5ENwMKYoXIBCcDAkRPAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAGwMCRF8DC
====catalogjs annotation end====*/