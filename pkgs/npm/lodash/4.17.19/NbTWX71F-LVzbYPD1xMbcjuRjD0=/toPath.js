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
k5eVwqwuL2Rpc3QvOTguanMDwsCVwq0uL2Rpc3QvMTE3LmpzBsLAlcKsLi9pc0FycmF5LmpzCcLAlcKtLi9pc1N5bWJvbC5qcwzCwJXCrC4vZGlzdC81OC5qcw/CwJXCrC4vZGlzdC8yNy5qcxLCwJXCrS4vdG9TdHJpbmcuanMVwsCBp2RlZmF1bHSUoWymdG9QYXRoIcDcACOXoW8AAAPAkMCZoWQJAALAkQLAwpihaahhcnJheU1hcJICGsAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaljb3B5QXJyYXmSBR3AAadkZWZhdWx0wMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmnaXNBcnJheZIIGcACp2RlZmF1bHTAwJihcgsHwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaahpc1N5bWJvbJILHMADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7AwpihaaxzdHJpbmdUb1BhdGiSDh7ABKdkZWZhdWx0wMCYoXILDMDAkQ3AwpyhaQEXDRKQwMIEwsDAmaFkCQARwJERwMKYoWmldG9LZXmSERvABadkZWZhdWx0wMCYoXILBcDAkRDAwpyhaQEXEBWQwMIFwsDAmaFkCQAUwJEUwMKYoWmodG9TdHJpbmeSFB/ABqdkZWZhdWx0wMCYoXILCMDAkRPAwpyhaQEYExaQwMIGwsDAl6FvAQAXIJDAmaFkAAwYwJgZGhscHR4fGMDCmKFspnRvUGF0aJIYIsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b1BhdGguanOYoXIJBsAZkRfAwpihchAHwBqRB8DCmKFyFgjAG5EBwMKYoXIIBcAckRDAwpihchEIwB2RCsDCmKFyFAnAHpEEwMKYoXIBDMAfkQ3AwpihcgEIwMCRE8DCmKFnAQMhwJDAwpihZwkLIsCRIsDCmKFyAAbAwJEXwMI=
====catalogjs annotation end====*/