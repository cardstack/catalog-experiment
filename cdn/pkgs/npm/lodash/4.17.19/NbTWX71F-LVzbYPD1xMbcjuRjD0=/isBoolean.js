import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var boolTag = '[object Boolean]';
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
}
export { isBoolean as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJWhbKlpc0Jvb2xlYW4RwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaapiYXNlR2V0VGFnkgIOwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxpc09iamVjdExpa2WSBQ3AAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACBCQwJihZwABCQuQwMKZoWQEFQrAkgoIwMKZoWynYm9vbFRhZ5IKD8DAwAiQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNCb29sZWFuLmpzmKFyAAfAwJEJwMKZoWQBAwzAlQ0ODwwJwMKZoWypaXNCb29sZWFukgwSwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Jvb2xlYW4uanOYoXIJCcANkQvAwpihcjgMwA6RBMDCmKFyCwrAD5EBwMKYoXILB8DAkQnAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAJwMCRC8DC
====catalogjs annotation end====*/