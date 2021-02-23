import { default as baseUpdate } from "./dist/13.js";
import { default as castFunction } from "./dist/108.js";
function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}
export { update as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTMuanMDwsCVwq0uL2Rpc3QvMTA4LmpzB8LAgadkZWZhdWx0laFspnVwZGF0ZQ/AwNwAEZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqmJhc2VVcGRhdGWSAgzAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmsY2FzdEZ1bmN0aW9ukgYNwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEACg6QwJmhZAANC8CTDA0LwMKZoWymdXBkYXRlkgsQwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91cGRhdGUuanOYoXIJBsAMkQrAwpihcj0KwA2RAcDCmKFyDwzAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIABsDAkQrAwg==
====catalogjs annotation end====*/