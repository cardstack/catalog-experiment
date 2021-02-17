import { default as baseIndexOf } from "./123.js";
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

  return index;
}
export { charsEndIndex as default };
/*====catalogjs annotation start====
k5GVwqguLzEyMy5qcwPCwIGnZGVmYXVsdJWhbK1jaGFyc0VuZEluZGV4CsDAnJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq2Jhc2VJbmRleE9mkgIIwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCArAwJDAwpehbwEABgmQwJmhZAA+B8CSCAfAwpmhbK1jaGFyc0VuZEluZGV4kgcLwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2hhcnNFbmRJbmRleC5qc5ihcgkNwAiRBsDCmKFyUQvAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIADcDAkQbAwg==
====catalogjs annotation end====*/