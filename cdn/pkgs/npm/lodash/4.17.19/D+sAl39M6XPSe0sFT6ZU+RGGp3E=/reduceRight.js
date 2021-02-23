import { default as baseEachRight } from "./dist/78.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseReduce } from "./dist/172.js";
import { default as isArray } from "./isArray.js";
function arrayReduceRight(array, iteratee, accumulator, initAccum) {
  var length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[--length];
  }

  while (length--) {
    accumulator = iteratee(accumulator, array[length], length, array);
  }

  return accumulator;
}
function reduceRight(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduceRight : baseReduce,
      initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
}
export { reduceRight as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNzguanMDwsCVwqsuL2Rpc3QvNi5qcwfCwJXCrS4vZGlzdC8xNzIuanMLwsCVwqwuL2lzQXJyYXkuanMPwsCBp2RlZmF1bHSVoWyrcmVkdWNlUmlnaHQdwMDcAB+XoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa1iYXNlRWFjaFJpZ2h0kgIbwACnZGVmYXVsdMDAwJihcgsNwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFprGJhc2VJdGVyYXRlZZIGGsABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgNwMCQwMKZoWQJAAoMkQrAwpmhaapiYXNlUmVkdWNlkgoZwAKnZGVmYXVsdMDAwJihcgsKwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpp2lzQXJyYXmSDhfAA6dkZWZhdWx0wMDAmKFyCwfAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIDsDAkMDCl6FvAQASFJDAmaFkAM0BGxPAkRPAwpmhbLBhcnJheVJlZHVjZVJpZ2h0khMYwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlSZWR1Y2VSaWdodC5qc5ihcgkQwMCREsDCl6FvAQAVHJDAmaFkAAQWwJYXGBkaGxbAwpmhbKtyZWR1Y2VSaWdodJIWHsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVkdWNlUmlnaHQuanOYoXIJC8AXkRXAwpihcjMHwBiRDcDCmKFyDxDAGZESwMKYoXIDCsAakQnAwpihckQMwBuRBcDCmKFyJw3AwJEBwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIAC8DAkRXAwg==
====catalogjs annotation end====*/