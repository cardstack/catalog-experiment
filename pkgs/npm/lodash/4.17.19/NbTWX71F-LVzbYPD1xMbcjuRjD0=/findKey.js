import { default as baseFindKey } from "./dist/164.js";
import { default as baseForOwn } from "./dist/77.js";
import { default as baseIteratee } from "./dist/6.js";
function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate, 3), baseForOwn);
}
export { findKey as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTY0LmpzA8LAlcKsLi9kaXN0Lzc3LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWynZmluZEtleRHA3AATl6FvAAADwJDAmaFkCQACwJECwMKYoWmrYmFzZUZpbmRLZXmSAg3AAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYmFzZUZvck93bpIFD8ABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCA7AAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkAAQMwJQNDg8MwMKYoWynZmluZEtleZIMEsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maW5kS2V5LmpzmKFyCQfADZELwMKYoXIfC8AOkQHAwpihcgkMwA+RB8DCmKFyEArAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAB8DAkQvAwg==
====catalogjs annotation end====*/