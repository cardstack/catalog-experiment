import { default as isArrayLike } from "./isArrayLike.js";
import { default as isObjectLike } from "./isObjectLike.js";
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
export { isArrayLikeObject as default };
/*====catalogjs annotation start====
k5KVwrAuL2lzQXJyYXlMaWtlLmpzA8LAlcKxLi9pc09iamVjdExpa2UuanMGwsCBp2RlZmF1bHSUoWyxaXNBcnJheUxpa2VPYmplY3QNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaatpc0FycmF5TGlrZZICC8AAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABsBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxpc09iamVjdExpa2WSBQrAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEcBAeQwMIBwsDAl6FvAQAIDJDAmaFkAAoJwJMKCwnAwpihbLFpc0FycmF5TGlrZU9iamVjdJIJDsDAwMDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0FycmF5TGlrZU9iamVjdC5qc5ihcgkRwAqRCMDCmKFyEwzAC5EEwMKYoXILC8DAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgARwMCRCMDC
====catalogjs annotation end====*/