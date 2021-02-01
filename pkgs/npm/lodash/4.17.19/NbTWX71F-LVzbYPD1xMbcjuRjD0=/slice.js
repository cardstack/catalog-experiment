import { default as baseSlice } from "./dist/142.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
function slice(array, start, end) {
  var length = array == null ? 0 : array.length;

  if (!length) {
    return [];
  }

  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  } else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }

  return baseSlice(array, start, end);
}
export { slice as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTQyLmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSUoWylc2xpY2USwNwAFJehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqWJhc2VTbGljZZICEMAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa5pc0l0ZXJhdGVlQ2FsbJIFDcABp2RlZmF1bHTAwJihcgsOwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKTCA4PwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGQcKkMDCAsLAwJehbwEACxGQwJmhZAAWDMCVDQ4PEAzAwpihbKVzbGljZZIME8DAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zbGljZS5qc5ihcgkFwA2RC8DCmKFyzJQOwA6RBMDCmKFyYwnAD5EHwMKYoXIwCcAQkQfAwpihchUJwMCRAcDCmKFnAQMSwJDAwpihZwkLE8CRE8DCmKFyAAXAwJELwMI=
====catalogjs annotation end====*/