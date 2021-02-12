import { default as baseIteratee } from "./dist/6.js";
import { default as baseMean } from "./dist/167.js";
function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee, 2));
}
export { meanBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNjcuanMGwsCBp2RlZmF1bHSVoWymbWVhbkJ5DcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZU1lYW6SBQrAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAARCcCTCgsJwMKZoWymbWVhbkJ5kgkOwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tZWFuQnkuanOYoXIJBsAKkQjAwpihch0IwAuRBMDCmKFyCAzAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/