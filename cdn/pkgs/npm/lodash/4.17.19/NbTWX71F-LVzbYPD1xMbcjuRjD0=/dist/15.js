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
k5aVwqcuLzE3LmpzA8LAlcKxLi4vaXNBcmd1bWVudHMuanMGwsCVwq0uLi9pc0FycmF5LmpzCcLAlcKoLi8xMjguanMMwsCVwq4uLi9pc0xlbmd0aC5qcw/CwJXCpy4vMjcuanMSwsCBp2RlZmF1bHSVoWynaGFzUGF0aB3AwNwAH5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGNhc3RQYXRokgIWwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaatpc0FyZ3VtZW50c5IFG8ABp2RlZmF1bHTAwMCYoXILC8DAkQTAwpyhaQEcBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmnaXNBcnJheZIIGsACp2RlZmF1bHTAwMCYoXILB8DAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKZoWmnaXNJbmRleJILGcADp2RlZmF1bHTAwMCYoXILB8DAkQrAwpyhaQETCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmoaXNMZW5ndGiSDhjABKdkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBGQ0SkMDCBMLAwJmhZAkAEcCREcDCmaFppXRvS2V5khEXwAWnZGVmYXVsdMDAwJihcgsFwMCREMDCnKFpARIQE5DAwgXCwMCXoW8BABQckMCZoWQADBXAlxYXGBkaGxXAwpmhbKdoYXNQYXRokhUewMDAwJDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faGFzUGF0aC5qc5ihcgkHwBaRFMDCmKFyIwjAF5EBwMKYoXLMgAXAGJEQwMKYoXLNAQIIwBmRDcDCmKFyDAfAGpEKwMKYoXISB8AbkQfAwpihcgwLwMCRBMDCmKFnAQMdwJDAwpihZwkLHsCRHsDCmKFyAAfAwJEUwMI=
====catalogjs annotation end====*/