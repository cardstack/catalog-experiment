import { default as baseForOwn } from "./dist/77.js";
import { default as castFunction } from "./dist/108.js";
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}
export { forOwn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNzcuanMDwsCVwq0uL2Rpc3QvMTA4LmpzB8LAgadkZWZhdWx0laFspmZvck93bg/AwNwAEZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmJhc2VGb3JPd26SAgzAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmsY2FzdEZ1bmN0aW9ukgYNwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEACg6QwJmhZAAOC8CTDA0LwMKZoWymZm9yT3dukgsQwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JPd24uanOYoXIJBsAMkQrAwpihcigKwA2RAcDCmKFyCQzAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIABsDAkQrAwg==
====catalogjs annotation end====*/