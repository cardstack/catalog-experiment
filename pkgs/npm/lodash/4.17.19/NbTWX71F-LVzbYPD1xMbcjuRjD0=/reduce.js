import { default as arrayReduce } from "./dist/146.js";
import { default as baseEach } from "./dist/75.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseReduce } from "./dist/172.js";
import { default as isArray } from "./isArray.js";
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}
export { reduce as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTQ2LmpzA8LAlcKsLi9kaXN0Lzc1LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwq0uL2Rpc3QvMTcyLmpzDMLAlcKsLi9pc0FycmF5LmpzD8LAgadkZWZhdWx0lKFspnJlZHVjZRnA3AAbl6FvAAADwJDAmaFkCQACwJECwMKYoWmrYXJyYXlSZWR1Y2WSAhTAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoYmFzZUVhY2iSBRfAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggWwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqmJhc2VSZWR1Y2WSCxXAA6dkZWZhdWx0wMCYoXILCsDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmnaXNBcnJheZIOE8AEp2RlZmF1bHTAwJihcgsHwMCRDcDCnKFpARcNEJDAwgTCwMCXoW8BABEYkMCZoWQABBLAlhMUFRYXEsDCmKFspnJlZHVjZZISGsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZWR1Y2UuanOYoXIJBsATkRHAwpihcjMHwBSRDcDCmKFyDwvAFZEBwMKYoXIDCsAWkQrAwpihckQMwBeRB8DCmKFyJwjAwJEEwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIABsDAkRHAwg==
====catalogjs annotation end====*/