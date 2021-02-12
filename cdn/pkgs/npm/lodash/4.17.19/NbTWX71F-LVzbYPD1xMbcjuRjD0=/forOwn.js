import { default as baseForOwn } from "./dist/77.js";
import { default as castFunction } from "./dist/108.js";
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}
export { forOwn as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNzcuanMDwsCVwq0uL2Rpc3QvMTA4LmpzBsLAgadkZWZhdWx0laFspmZvck93bg3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaapiYXNlRm9yT3dukgIKwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxjYXN0RnVuY3Rpb26SBQvAAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAyQwJmhZAAOCcCTCgsJwMKZoWymZm9yT3dukgkOwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mb3JPd24uanOYoXIJBsAKkQjAwpihcigKwAuRAcDCmKFyCQzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIABsDAkQjAwg==
====catalogjs annotation end====*/