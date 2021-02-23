import { default as isArrayLikeObject } from "../isArrayLikeObject.js";
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}
export { castArrayLikeObject as default };
/*====catalogjs annotation start====
k5GVwrcuLi9pc0FycmF5TGlrZU9iamVjdC5qcwPCwIGnZGVmYXVsdJWhbLNjYXN0QXJyYXlMaWtlT2JqZWN0CsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpsWlzQXJyYXlMaWtlT2JqZWN0kgIIwACnZGVmYXVsdMDAwJihcgsRwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCBnAwJDAwpehbwEABgmQwJmhZAAXB8CSCAfAwpmhbLNjYXN0QXJyYXlMaWtlT2JqZWN0kgcLwMDAwJDZVFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2FzdEFycmF5TGlrZU9iamVjdC5qc5ihcgkTwAiRBsDCmKFyExHAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAE8DAkQbAwg==
====catalogjs annotation end====*/