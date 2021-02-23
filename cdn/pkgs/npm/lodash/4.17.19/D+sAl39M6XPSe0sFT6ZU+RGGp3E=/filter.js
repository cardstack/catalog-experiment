import { default as arrayFilter } from "./dist/150.js";
import { default as baseFilter } from "./dist/73.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}
export { filter as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzczLmpzB8LAlcKrLi9kaXN0LzYuanMLwsCVwqwuL2lzQXJyYXkuanMPwsCBp2RlZmF1bHSVoWymZmlsdGVyGcDA3AAbl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYXJyYXlGaWx0ZXKSAhXAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmqYmFzZUZpbHRlcpIGFsABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaaxiYXNlSXRlcmF0ZWWSChfAAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDcDAkMDCmaFkCQAOEJEOwMKZoWmnaXNBcnJheZIOFMADp2RlZmF1bHTAwMCYoXILB8DAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgOwMCQwMKXoW8BABIYkMCZoWQAEhPAlRQVFhcTwMKZoWymZmlsdGVykhMawMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9maWx0ZXIuanOYoXIJBsAUkRLAwpihcicHwBWRDcDCmKFyDwvAFpEBwMKYoXIDCsAXkQXAwpihchwMwMCRCcDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAbAwJESwMI=
====catalogjs annotation end====*/