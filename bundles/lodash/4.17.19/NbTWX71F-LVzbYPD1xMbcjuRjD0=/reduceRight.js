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
k5SVwqwuL2Rpc3QvNzguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrS4vZGlzdC8xNzIuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCBp2RlZmF1bHSUoWyrcmVkdWNlUmlnaHQZwNwAG5ehbwAAA8CSDhHAmaFkCQACwJECwMKYoWmtYmFzZUVhY2hSaWdodJICF8AAp2RlZmF1bHTAwJihcgsNwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlSXRlcmF0ZWWSBRbAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmqYmFzZVJlZHVjZZIIFcACp2RlZmF1bHTAwJihcgsKwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaadpc0FycmF5kgsTwAOnZGVmYXVsdMDAmKFyCwfAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhCQwJmhZADNARsPwJEPwMKYoWywYXJyYXlSZWR1Y2VSaWdodJIPFMDAwMDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlSZWR1Y2VSaWdodC5qc5ihcgkQwMCRDsDCl6FvAQARGJDAmaFkAAQSwJYTFBUWFxLAwpihbKtyZWR1Y2VSaWdodJISGsDAwMDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZWR1Y2VSaWdodC5qc5ihcgkLwBOREcDCmKFyMwfAFJEKwMKYoXIPEMAVkQ7AwpihcgMKwBaRB8DCmKFyRAzAF5EEwMKYoXInDcDAkQHAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgALwMCREcDC
====catalogjs annotation end====*/