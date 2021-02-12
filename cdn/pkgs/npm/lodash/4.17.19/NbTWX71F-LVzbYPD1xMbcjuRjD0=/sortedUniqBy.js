import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedUniq } from "./dist/131.js";
function sortedUniqBy(array, iteratee) {
  return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee, 2)) : [];
}
export { sortedUniqBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xMzEuanMGwsCBp2RlZmF1bHSVoWysc29ydGVkVW5pcUJ5DcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmuYmFzZVNvcnRlZFVuaXGSBQrAAadkZWZhdWx0wMDAmKFyCw7AwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAWCcCTCgsJwMKZoWysc29ydGVkVW5pcUJ5kgkOwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb3J0ZWRVbmlxQnkuanOYoXIJDMAKkQjAwpihcjUOwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADMDAkQjAwg==
====catalogjs annotation end====*/