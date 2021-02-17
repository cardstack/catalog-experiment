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
k5SVwqguLi9lcS5qcwPCwJXCsS4uL2lzQXJyYXlMaWtlLmpzB8LAlcKoLi8xMjguanMLwsCVwq4uLi9pc09iamVjdC5qcw/CwIGnZGVmYXVsdJWhbK5pc0l0ZXJhdGVlQ2FsbBnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpomVxkgIXwACnZGVmYXVsdMDAwJihcgsCwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFpq2lzQXJyYXlMaWtlkgYVwAGnZGVmYXVsdMDAwJihcgsLwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCBPAwJDAwpmhZAkACgyRCsDCmaFpp2lzSW5kZXiSChbAAqdkZWZhdWx0wMDAmKFyCwfAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcICsDAkMDCmaFkCQAOEJEOwMKZoWmoaXNPYmplY3SSDhTAA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIEMDAkMDCl6FvAQASGJDAmaFkAC4TwJUUFRYXE8DCmaFsrmlzSXRlcmF0ZWVDYWxskhMawMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNJdGVyYXRlZUNhbGwuanOYoXIJDsAUkRLAwpihciAIwBWRDcDCmKFyWAvAFpEFwMKYoXIMB8AXkQnAwpihcksCwMCRAcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAA7AwJESwMI=
====catalogjs annotation end====*/