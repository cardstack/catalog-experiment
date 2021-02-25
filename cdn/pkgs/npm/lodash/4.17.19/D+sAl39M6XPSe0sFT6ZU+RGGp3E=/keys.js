import { default as arrayLikeKeys } from "./dist/84.js";
import { default as baseKeys } from "./dist/132.js";
import { default as isArrayLike } from "./isArrayLike.js";
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
export { keys as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODQuanMDwsCVwq0uL2Rpc3QvMTMyLmpzB8LAlcKwLi9pc0FycmF5TGlrZS5qcwvCwIGnZGVmYXVsdJWhbKRrZXlzFMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmtYXJyYXlMaWtlS2V5c5ICEcAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaahiYXNlS2V5c5IGEsABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaatpc0FycmF5TGlrZZIKEMACp2RlZmF1bHTAwMCYoXILC8DAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgSwMCQwMKXoW8BAA4TkMCZoWQACw/AlBAREg/AwpmhbKRrZXlzkg8VwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9rZXlzLmpzmKFyCQTAEJEOwMKYoXIUC8ARkQnAwpihcgsNwBKRAcDCmKFyCwjAwJEFwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIABMDAkQ7Awg==
====catalogjs annotation end====*/