import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var difference = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
export { difference as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMGwsCVwqwuL2Rpc3QvNDkuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAgadkZWZhdWx0laFsqmRpZmZlcmVuY2UYwMDcABqXoW8AAAPAkQ/AmaFkCQACwJECwMKZoWmuYmFzZURpZmZlcmVuY2WSAhTAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpq2Jhc2VGbGF0dGVukgUVwAGnZGVmYXVsdMDAwJihcgsLwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaahiYXNlUmVzdJIIEsACp2RlZmF1bHTAwMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKZoWmxaXNBcnJheUxpa2VPYmplY3STCxMWwAOnZGVmYXVsdMDAwJihcgsRwMCRCsDCnKFpASEKDZDAwgPCwMCXoW8BAA4XkMCYoWcAAQ/AkMDCmaFkBAAQwJMQDhHAwpmhbKpkaWZmZXJlbmNlkhAZwMDADpDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kaWZmZXJlbmNlLmpzmKFyAArAEZEPwMKYoWcDERLAlRITFBUWwMKYoXIACMATkQfAwpihciURwBSRCsDCmKFyCg7AFZEBwMKYoXIIC8AWkQTAwpihcgwRwMCRCsDCmKFnAQMYwJDAwpihZwkLGcCRGcDCmKFyAArAwJEPwMI=
====catalogjs annotation end====*/