import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseMap } from "./dist/74.js";
import { default as isArray } from "./isArray.js";
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}
export { map as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC83NC5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJShbKNtYXAVwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpqGFycmF5TWFwkgIRwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGJhc2VJdGVyYXRlZZIFE8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpihaadiYXNlTWFwkggSwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpp2lzQXJyYXmSCxDAA6dkZWZhdWx0wMCYoXILB8DAkQrAwpyhaQEXCg2QwMIDwsDAl6FvAQAOFJDAmaFkABEPwJUQERITD8DCmKFso21hcJIPFsDAwMDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXAuanOYoXIJA8AQkQ7AwpihciYHwBGRCsDCmKFyDwjAEpEBwMKYoXIDB8ATkQfAwpihchwMwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAPAwJEOwMI=
====catalogjs annotation end====*/