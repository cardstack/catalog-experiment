import { default as baseGetTag } from "./dist/86.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
var stringTag = '[object String]';
function isString(value) {
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
export { isString as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvODYuanMDwsCVwqwuL2lzQXJyYXkuanMGwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwnCwIGnZGVmYXVsdJShbKhpc1N0cmluZxXA3AAXl6FvAAADwJDAmaFkCQACwJECwMKYoWmqYmFzZUdldFRhZ5ICEsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaadpc0FycmF5kgUQwAGnZGVmYXVsdMDAmKFyCwfAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGlzT2JqZWN0TGlrZZIIEcACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARwHCpDAwgLCwMCXoW8BAAsUkMCYoWcAAQwOkMDCmaFkBBQNwJINC8DCmKFsqXN0cmluZ1RhZ5INE8DAwAvZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N0cmluZy5qc5ihcgAJwMCRDMDCmaFkAQMPwJYQERITDwzAwpihbKhpc1N0cmluZ5IPFsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc1N0cmluZy5qc5ihcgkIwBCRDsDCmKFyMAfAEZEEwMKYoXILDMASkQfAwpihcgsKwBORAcDCmKFyCwnAwJEMwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACMDAkQ7Awg==
====catalogjs annotation end====*/