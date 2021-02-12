import { default as baseFor } from "./dist/158.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forIn(object, iteratee) {
  return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
}
export { forIn as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU4LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwbCwJXCqy4va2V5c0luLmpzCcLAgadkZWZhdWx0laFspWZvckluEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmnYmFzZUZvcpICDcAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmsY2FzdEZ1bmN0aW9ukgUOwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaZrZXlzSW6SCA/AAqdkZWZhdWx0wMDAmKFyCwbAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAEDMCUDQ4PDMDCmaFspWZvcklukgwSwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JJbi5qc5ihcgkFwA2RC8DCmKFyOAfADpEBwMKYoXIJDMAPkQTAwpihcgwGwMCRB8DCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAXAwJELwMI=
====catalogjs annotation end====*/