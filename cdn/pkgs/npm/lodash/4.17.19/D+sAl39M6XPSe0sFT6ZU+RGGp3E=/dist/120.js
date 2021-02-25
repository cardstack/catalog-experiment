import { default as baseIndexOf } from "./123.js";
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
export { arrayIncludes as default };
/*====catalogjs annotation start====
k5GVwqguLzEyMy5qcwPCwIGnZGVmYXVsdJWhbK1hcnJheUluY2x1ZGVzCsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VJbmRleE9mkgIIwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCArAwJDAwpehbwEABgmQwJmhZAAZB8CSCAfAwpmhbK1hcnJheUluY2x1ZGVzkgcLwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlJbmNsdWRlcy5qc5ihcgkNwAiRBsDCmKFyVwvAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIADcDAkQbAwg==
====catalogjs annotation end====*/