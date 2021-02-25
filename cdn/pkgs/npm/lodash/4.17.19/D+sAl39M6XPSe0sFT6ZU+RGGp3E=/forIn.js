import { default as baseFor } from "./dist/158.js";
import { default as castFunction } from "./dist/108.js";
import { default as keysIn } from "./keysIn.js";
function forIn(object, iteratee) {
  return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
}
export { forIn as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTU4LmpzA8LAlcKtLi9kaXN0LzEwOC5qcwfCwJXCqy4va2V5c0luLmpzC8LAgadkZWZhdWx0laFspWZvckluFMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmnYmFzZUZvcpICEMAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaaxjYXN0RnVuY3Rpb26SBhHAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmma2V5c0lukgoSwAKnZGVmYXVsdMDAwJihcgsGwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCA3AwJDAwpehbwEADhOQwJmhZAAED8CUEBESD8DCmaFspWZvcklukg8VwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JJbi5qc5ihcgkFwBCRDsDCmKFyOAfAEZEBwMKYoXIJDMASkQXAwpihcgwGwMCRCcDCmKFnAQMUwJDAwpihZwkLFcCRFcDCmKFyAAXAwJEOwMI=
====catalogjs annotation end====*/