import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var unionBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2));
});
export { unionBy as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvODUuanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC80OS5qcwnCwJXCrC4vZGlzdC82My5qcwzCwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMPwsCVwqkuL2xhc3QuanMSwsCBp2RlZmF1bHSVoWyndW5pb25CeSDAwNwAIpehbwAAA8CRFcCZoWQJAALAkQLAwpmhaatiYXNlRmxhdHRlbpICHMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsYmFzZUl0ZXJhdGVlkgUewAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahiYXNlUmVzdJIIGMACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmoYmFzZVVuaXGSCxvAA6dkZWZhdWx0wMDAmKFyCwjAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmaFpsWlzQXJyYXlMaWtlT2JqZWN0kw4aHcAEp2RlZmF1bHTAwMCYoXILEcDAkQ3AwpyhaQEhDRKQwMIEwsDAmaFkCQARwJERwMKZoWmkbGFzdJIRGcAFp2RlZmF1bHTAwMCYoXILBMDAkRDAwpyhaQEUEBOQwMIFwsDAl6FvAQAUH5DAmKFnAAEVwJDAwpmhZAQAFsCTFhQXwMKZoWyndW5pb25CeZIWIcDAwBSQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pb25CeS5qc5ihcgAHwBeRFcDCmKFnAxIYwJcYGRobHB0ewMKYoXIACMAZkQfAwpihciYEwBqREMDCmKFyERHAG5ENwMKYoXI2CMAckQrAwpihcgELwB2RAcDCmKFyDBHAHpENwMKYoXIJDMDAkQTAwpihZwEDIMCQwMKYoWcJCyHAkSHAwpihcgAHwMCRFcDC
====catalogjs annotation end====*/