import { default as baseDifference } from "./dist/61.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var without = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, values) : [];
});
export { without as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvNDkuanMGwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzCcLAgadkZWZhdWx0laFsp3dpdGhvdXQTwMDcABWXoW8AAAPAkQzAmaFkCQACwJECwMKZoWmuYmFzZURpZmZlcmVuY2WSAhHAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqGJhc2VSZXN0kgUPwAGnZGVmYXVsdMDAwJihcgsIwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhabFpc0FycmF5TGlrZU9iamVjdJIIEMACp2RlZmF1bHTAwMCYoXILEcDAkQfAwpyhaQEhBwqQwMICwsDAl6FvAQALEpDAmKFnAAEMwJDAwpmhZAQADcCTDQsOwMKZoWynd2l0aG91dJINFMDAwAuQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd2l0aG91dC5qc5ihcgAHwA6RDMDCmKFnAxgPwJMPEBHAwpihcgAIwBCRBMDCmKFyJRHAEZEHwMKYoXIKDsDAkQHAwpihZwEDE8CQwMKYoWcJCxTAkRTAwpihcgAHwMCRDMDC
====catalogjs annotation end====*/