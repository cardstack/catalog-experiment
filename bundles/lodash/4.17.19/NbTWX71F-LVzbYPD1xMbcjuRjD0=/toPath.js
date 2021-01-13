import { default as arrayMap } from "./dist/98.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
import { default as isSymbol } from "./isSymbol.js";
import { default as stringToPath } from "./dist/58.js";
import { default as toKey } from "./dist/27.js";
import { default as toString } from "./toString.js";
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }

  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}
export { toPath as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvOTguanMDwsCVwq0uL2Rpc3QvMTE3LmpzBsLAlcKsLi9pc0FycmF5LmpzCcLAlcKtLi9pc1N5bWJvbC5qcwzCwJXCrC4vZGlzdC81OC5qcw/CwJXCrC4vZGlzdC8yNy5qcxLCwJXCrS4vdG9TdHJpbmcuanMVwsCBp2RlZmF1bHSUoWymdG9QYXRoIcDcACOXoW8AAAPAkRfAmaFkCQACwJECwMKYoWmoYXJyYXlNYXCSAhrAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpY29weUFycmF5kgUdwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpp2lzQXJyYXmSCBnAAqdkZWZhdWx0wMCYoXILB8DAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmoaXNTeW1ib2ySCxzAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmsc3RyaW5nVG9QYXRokg4ewASnZGVmYXVsdMDAmKFyCwzAwJENwMKcoWkBFw0SkMDCBMLAwJmhZAkAEcCREcDCmKFppXRvS2V5khEbwAWnZGVmYXVsdMDAmKFyCwXAwJEQwMKcoWkBFxAVkMDCBcLAwJmhZAkAFMCRFMDCmKFpqHRvU3RyaW5nkhQfwAanZGVmYXVsdMDAmKFyCwjAwJETwMKcoWkBGBMWkMDCBsLAwJehbwEAFyCQwJmhZAAMGMCYGRobHB0eHxjAwpihbKZ0b1BhdGiSGCLAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdG9QYXRoLmpzmKFyCQbAGZEXwMKYoXIQB8AakQfAwpihchYIwBuRAcDCmKFyCAXAHJEQwMKYoXIRCMAdkQrAwpihchQJwB6RBMDCmKFyAQzAH5ENwMKYoXIBCMDAkRPAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAGwMCRF8DC
====catalogjs annotation end====*/