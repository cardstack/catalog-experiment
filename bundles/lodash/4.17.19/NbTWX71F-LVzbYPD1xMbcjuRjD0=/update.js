import { default as baseUpdate } from "./dist/13.js";
import { default as castFunction } from "./dist/108.js";
function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}
export { update as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMTMuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0lKFspnVwZGF0ZQ3An5ehbwAAA8CRCMCZoWQJAALAkQLAwpihaapiYXNlVXBkYXRlkgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGNhc3RGdW5jdGlvbpIFC8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQADQnAkwoLCcDCmKFspnVwZGF0ZZIJDsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91cGRhdGUuanOYoXIJBsAKkQjAwpihcj0KwAuRAcDCmKFyDwzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/