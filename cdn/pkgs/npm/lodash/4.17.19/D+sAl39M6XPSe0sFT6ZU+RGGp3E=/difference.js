import { default as baseDifference } from "./dist/61.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var difference = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
});
export { difference as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvODUuanMHwsCVwqwuL2Rpc3QvNDkuanMLwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzD8LAgadkZWZhdWx0laFsqmRpZmZlcmVuY2UcwMDcAB6XoW8AAAPAkRPAmaFkCQACBJECwMKZoWmuYmFzZURpZmZlcmVuY2WSAhjAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmrYmFzZUZsYXR0ZW6SBhnAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmoYmFzZVJlc3SSChbAAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmxaXNBcnJheUxpa2VPYmplY3STDhcawAOnZGVmYXVsdMDAwJihcgsRwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCBjAwJDAwpehbwEAEhuQwJihZwABE8CQwMKZoWQEABTAkxQSFcDCmaFsqmRpZmZlcmVuY2WSFB3AwMASkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RpZmZlcmVuY2UuanOYoXIACsAVkRPAwpihZwMRFsCVFhcYGRrAwpihcgAIwBeRCcDCmKFyJRHAGJENwMKYoXIKDsAZkQHAwpihcggLwBqRBcDCmKFyDBHAwJENwMKYoWcBAxzAkMDCmKFnCQsdwJEdwMKYoXIACsDAkRPAwg==
====catalogjs annotation end====*/