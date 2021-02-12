import { default as eq } from "../eq.js";
import { default as isArrayLike } from "../isArrayLike.js";
import { default as isIndex } from "./128.js";
import { default as isObject } from "../isObject.js";
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }

  var type = typeof index;

  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
  }

  return false;
}
export { isIterateeCall as default };
/*====catalogjs annotation start====
k5SVwqguLi9lcS5qcwPCwJXCsS4uL2lzQXJyYXlMaWtlLmpzBsLAlcKoLi8xMjguanMJwsCVwq4uLi9pc09iamVjdC5qcwzCwIGnZGVmYXVsdJWhbK5pc0l0ZXJhdGVlQ2FsbBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpomVxkgITwACnZGVmYXVsdMDAwJihcgsCwMCRAcDCnKFpABMBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaatpc0FycmF5TGlrZZIFEcABp2RlZmF1bHTAwMCYoXILC8DAkQTAwpyhaQEcBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmnaXNJbmRleJIIEsACp2RlZmF1bHTAwMCYoXILB8DAkQfAwpyhaQETBwyQwMICwsDAmaFkCQALwJELwMKZoWmoaXNPYmplY3SSCxDAA6dkZWZhdWx0wMDAmKFyCwjAwJEKwMKcoWkBGQoNkMDCA8LAwJehbwEADhSQwJmhZAAuD8CVEBESEw/AwpmhbK5pc0l0ZXJhdGVlQ2FsbJIPFsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzSXRlcmF0ZWVDYWxsLmpzmKFyCQ7AEJEOwMKYoXIgCMARkQrAwpihclgLwBKRBMDCmKFyDAfAE5EHwMKYoXJLAsDAkQHAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAOwMCRDsDC
====catalogjs annotation end====*/