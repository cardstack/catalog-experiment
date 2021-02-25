import { default as baseEach } from "./dist/75.js";
import { default as arraySome } from "./dist/151.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
function baseSome(collection, predicate) {
  var result;
  baseEach(collection, function (value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}
export { some as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNzUuanMDwsCVwq0uL2Rpc3QvMTUxLmpzB8LAlcKrLi9kaXN0LzYuanMLwsCVwqwuL2lzQXJyYXkuanMPwsCVwqwuL2Rpc3QvNzAuanMTwsCBp2RlZmF1bHSVoWykc29tZSLAwNwAJJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGJhc2VFYWNokgIYwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqWFycmF5U29tZZIGHcABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaaxiYXNlSXRlcmF0ZWWSCiDAAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDcDAkMDCmaFkCQAOEJEOwMKZoWmnaXNBcnJheZIOHMADp2RlZmF1bHTAwMCYoXILB8DAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgOwMCQwMKZoWQJABIUkRLAwpmhaa5pc0l0ZXJhdGVlQ2FsbJISH8AEp2RlZmF1bHTAwMCYoXILDsDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgOwMCQwMKXoW8BABYZkMCZoWQAzJMXwJIYF8DCmaFsqGJhc2VTb21lkhcewMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVNvbWUuanOYoXIJCMAYkRbAwpihcioIwMCRAcDCl6FvAQAaIZDAmaFkABIbwJYcHR4fIBvAwpmhbKRzb21lkhsjwMDAwJDZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zb21lLmpzmKFyCQTAHJEawMKYoXIuB8AdkQ3Awpihcg8JwB6RBcDCmKFyAwjAH5EWwMKYoXISDsAgkRHAwpihclwMwMCRCcDCmKFnAQMiwJDAwpihZwkLI8CRI8DCmKFyAATAwJEawMI=
====catalogjs annotation end====*/