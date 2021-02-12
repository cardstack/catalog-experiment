import { default as baseDelay } from "./dist/161.js";
import { default as baseRest } from "./dist/49.js";
var defer = baseRest(function (func, args) {
  return baseDelay(func, 1, args);
});
export { defer as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTYxLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAgadkZWZhdWx0laFspWRlZmVyD8DA3AARl6FvAAADwJEJwJmhZAkAAsCRAsDCmaFpqWJhc2VEZWxheZICDcAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZVJlc3SSBQzAAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmaFspWRlZmVykgoQwMDACJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWZlci5qc5ihcgAFwAuRCcDCmKFnAxMMwJIMDcDCmKFyAAjADZEEwMKYoXIiCcDAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAFwMCRCcDC
====catalogjs annotation end====*/