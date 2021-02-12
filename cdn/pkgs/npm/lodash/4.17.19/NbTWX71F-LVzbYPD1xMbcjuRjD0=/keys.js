import { default as arrayLikeKeys } from "./dist/84.js";
import { default as baseKeys } from "./dist/132.js";
import { default as isArrayLike } from "./isArrayLike.js";
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
export { keys as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODQuanMDwsCVwq0uL2Rpc3QvMTMyLmpzBsLAlcKwLi9pc0FycmF5TGlrZS5qcwnCwIGnZGVmYXVsdJWhbKRrZXlzEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmtYXJyYXlMaWtlS2V5c5ICDsAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZUtleXOSBQ/AAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpq2lzQXJyYXlMaWtlkggNwAKnZGVmYXVsdMDAwJihcgsLwMCRB8DCnKFpARsHCpDAwgLCwMCXoW8BAAsQkMCZoWQACwzAlA0ODwzAwpmhbKRrZXlzkgwSwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9rZXlzLmpzmKFyCQTADZELwMKYoXIUC8AOkQfAwpihcgsNwA+RAcDCmKFyCwjAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABMDAkQvAwg==
====catalogjs annotation end====*/