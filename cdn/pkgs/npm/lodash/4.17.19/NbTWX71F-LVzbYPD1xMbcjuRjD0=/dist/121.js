import { default as baseIndexOf } from "./123.js";
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

  return index;
}
export { charsEndIndex as default };
/*====catalogjs annotation start====
k5GVwqguLzEyMy5qcwPCwIGnZGVmYXVsdJWhbK1jaGFyc0VuZEluZGV4CcDAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq2Jhc2VJbmRleE9mkgIHwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABMBBJDAwgDCwMCXoW8BAAUIkMCZoWQAPgbAkgcGwMKZoWytY2hhcnNFbmRJbmRleJIGCsDAwMCQ2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NoYXJzRW5kSW5kZXguanOYoXIJDcAHkQXAwpihclELwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAA3AwJEFwMI=
====catalogjs annotation end====*/