import { default as castPath } from "./17.js";
import { default as isArguments } from "../isArguments.js";
import { default as isArray } from "../isArray.js";
import { default as isIndex } from "./128.js";
import { default as isLength } from "../isLength.js";
import { default as toKey } from "./27.js";
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);
  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);

    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }

    object = object[key];
  }

  if (result || ++index != length) {
    return result;
  }

  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}
export { hasPath as default };
/*====catalogjs annotation start====
k5aVwqcuLzE3LmpzA8LAlcKxLi4vaXNBcmd1bWVudHMuanMHwsCVwq0uLi9pc0FycmF5LmpzC8LAlcKoLi8xMjguanMPwsCVwq4uLi9pc0xlbmd0aC5qcxPCwJXCpy4vMjcuanMXwsCBp2RlZmF1bHSVoWynaGFzUGF0aCPAwNwAJZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGNhc3RQYXRokgIcwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFpq2lzQXJndW1lbnRzkgYhwAGnZGVmYXVsdMDAwJihcgsLwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCBPAwJDAwpmhZAkACgyRCsDCmaFpp2lzQXJyYXmSCiDAAqdkZWZhdWx0wMDAmKFyCwfAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcID8DAkMDCmaFkCQAOEJEOwMKZoWmnaXNJbmRleJIOH8ADp2RlZmF1bHTAwMCYoXILB8DAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgKwMCQwMKZoWQJABIUkRLAwpmhaahpc0xlbmd0aJISHsAEp2RlZmF1bHTAwMCYoXILCMDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgQwMCQwMKZoWQJABYYkRbAwpmhaaV0b0tleZIWHcAFp2RlZmF1bHTAwMCYoXILBcDAkRXAwpyhaQEBFRmRGMDCBcLAwJihZwgJwMCQwMKXoW8BABoikMCZoWQADBvAlxwdHh8gIRvAwpmhbKdoYXNQYXRokhskwMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzUGF0aC5qc5ihcgkHwByRGsDCmKFyIwjAHZEBwMKYoXLMgAXAHpEVwMKYoXLNAQIIwB+REcDCmKFyDAfAIJENwMKYoXISB8AhkQnAwpihcgwLwMCRBcDCmKFnAQMjwJDAwpihZwkLJMCRJMDCmKFyAAfAwJEawMI=
====catalogjs annotation end====*/