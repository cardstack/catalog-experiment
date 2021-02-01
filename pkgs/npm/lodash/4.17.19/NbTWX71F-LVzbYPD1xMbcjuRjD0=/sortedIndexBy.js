import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2));
}
export { sortedIndexBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC8zMS5qcwbCwIGnZGVmYXVsdJShbK1zb3J0ZWRJbmRleEJ5DcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmsYmFzZUl0ZXJhdGVlkgILwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFpsWJhc2VTb3J0ZWRJbmRleEJ5kgUKwAGnZGVmYXVsdMDAmKFyCxHAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACAyQwJmhZAARCcCTCgsJwMKYoWytc29ydGVkSW5kZXhCeZIJDsDAwMDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRJbmRleEJ5LmpzmKFyCQ3ACpEIwMKYoXIkEcALkQTAwpihcg8MwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAA3AwJEIwMI=
====catalogjs annotation end====*/