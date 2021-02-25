import { default as baseDifference } from "./dist/61.js";
import { default as baseRest } from "./dist/49.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var without = baseRest(function (array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, values) : [];
});
export { without as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNjEuanMDwsCVwqwuL2Rpc3QvNDkuanMHwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzC8LAgadkZWZhdWx0laFsp3dpdGhvdXQWwMDcABiXoW8AAAPAkQ/AmaFkCQACBJECwMKZoWmuYmFzZURpZmZlcmVuY2WSAhTAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmoYmFzZVJlc3SSBhLAAadkZWZhdWx0wMDAmKFyCwjAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmxaXNBcnJheUxpa2VPYmplY3SSChPAAqdkZWZhdWx0wMDAmKFyCxHAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIGMDAkMDCl6FvAQAOFZDAmKFnAAEPwJDAwpmhZAQAEMCTEA4RwMKZoWynd2l0aG91dJIQF8DAwA6Q2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd2l0aG91dC5qc5ihcgAHwBGRD8DCmKFnAxgSwJMSExTAwpihcgAIwBORBcDCmKFyJRHAFJEJwMKYoXIKDsDAkQHAwpihZwEDFsCQwMKYoWcJCxfAkRfAwpihcgAHwMCRD8DC
====catalogjs annotation end====*/