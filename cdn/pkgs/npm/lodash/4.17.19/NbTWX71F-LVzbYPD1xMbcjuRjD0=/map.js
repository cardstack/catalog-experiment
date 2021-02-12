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
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC83NC5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJWhbKNtYXAVwMDcABeXoW8AAAPAkMCZoWQJAALAkQLAwpmhaahhcnJheU1hcJICEcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsYmFzZUl0ZXJhdGVlkgUTwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpmhaadiYXNlTWFwkggSwAKnZGVmYXVsdMDAwJihcgsHwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaadpc0FycmF5kgsQwAOnZGVmYXVsdMDAwJihcgsHwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4UkMCZoWQAEQ/AlRAREhMPwMKZoWyjbWFwkg8WwMDAwJDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXAuanOYoXIJA8AQkQ7AwpihciYHwBGRCsDCmKFyDwjAEpEBwMKYoXIDB8ATkQfAwpihchwMwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAPAwJEOwMI=
====catalogjs annotation end====*/