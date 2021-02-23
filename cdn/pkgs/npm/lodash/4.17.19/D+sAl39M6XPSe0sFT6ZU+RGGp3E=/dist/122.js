import { default as baseIndexOf } from "./123.js";
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

  return index;
}
export { charsStartIndex as default };
/*====catalogjs annotation start====
k5GVwqguLzEyMy5qcwPCwIGnZGVmYXVsdJWhbK9jaGFyc1N0YXJ0SW5kZXgKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZUluZGV4T2aSAgjAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICsDAkMDCl6FvAQAGCZDAmaFkAD4HwJIIB8DCmaFsr2NoYXJzU3RhcnRJbmRleJIHC8DAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NoYXJzU3RhcnRJbmRleC5qc5ihcgkPwAiRBsDCmKFybQvAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAD8DAkQbAwg==
====catalogjs annotation end====*/