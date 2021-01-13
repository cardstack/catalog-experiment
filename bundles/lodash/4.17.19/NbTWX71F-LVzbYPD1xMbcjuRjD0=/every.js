import { default as baseEach } from "./dist/75.js";
import { default as arrayEvery } from "./dist/163.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function (value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}
function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;

  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }

  return func(collection, baseIteratee(predicate, 3));
}
export { every as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNzUuanMDwsCVwq0uL2Rpc3QvMTYzLmpzBsLAlcKrLi9kaXN0LzYuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwqwuL2Rpc3QvNzAuanMPwsCBp2RlZmF1bHSUoWylZXZlcnkdwNwAH5ehbwAAA8CSERXAmaFkCQACwJECwMKYoWmoYmFzZUVhY2iSAhPAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqYXJyYXlFdmVyeZIFGMABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaaxiYXNlSXRlcmF0ZWWSCBvAAqdkZWZhdWx0wMCYoXILDMDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKYoWmnaXNBcnJheZILF8ADp2RlZmF1bHTAwJihcgsHwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaa5pc0l0ZXJhdGVlQ2FsbJIOGsAEp2RlZmF1bHTAwJihcgsOwMCRDcDCnKFpARcNEJDAwgTCwMCXoW8BABEUkMCZoWQAzJISwJITEsDCmKFsqWJhc2VFdmVyeZISGcDAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUV2ZXJ5LmpzmKFyCQnAE5ERwMKYoXIxCMDAkQHAwpehbwEAFRyQwJmhZAASFsCWFxgZGhsWwMKYoWylZXZlcnmSFh7AwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZXZlcnkuanOYoXIJBcAXkRXAwpihci4HwBiRCsDCmKFyDwrAGZEEwMKYoXIDCcAakRHAwpihchIOwBuRDcDCmKFyXAzAwJEHwMKYoWcBAx3AkMDCmKFnCQsewJEewMKYoXIABcDAkRXAwg==
====catalogjs annotation end====*/