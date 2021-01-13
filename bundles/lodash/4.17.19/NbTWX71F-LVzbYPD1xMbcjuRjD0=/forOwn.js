import { default as baseForOwn } from "./dist/77.js";
import { default as castFunction } from "./dist/108.js";
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}
export { forOwn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNzcuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0lKFspmZvck93bg3An5ehbwAAA8CRCMCZoWQJAALAkQLAwpihaapiYXNlRm9yT3dukgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGNhc3RGdW5jdGlvbpIFC8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQADgnAkwoLCcDCmKFspmZvck93bpIJDsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JPd24uanOYoXIJBsAKkQjAwpihcigKwAuRAcDCmKFyCQzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/