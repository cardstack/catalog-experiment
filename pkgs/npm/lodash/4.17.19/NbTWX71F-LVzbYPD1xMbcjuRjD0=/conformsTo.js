import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";
function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}
export { conformsTo as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzBsLAgadkZWZhdWx0lKFsqmNvbmZvcm1zVG8NwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaa5iYXNlQ29uZm9ybXNUb5ICCsAAp2RlZmF1bHTAwJihcgsOwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaRrZXlzkgULwAGnZGVmYXVsdMDAmKFyCwTAwJEEwMKcoWkBFAQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKYoWyqY29uZm9ybXNUb5IJDsDAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jb25mb3Jtc1RvLmpzmKFyCQrACpEIwMKYoXIuDsALkQHAwpihchEEwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAArAwJEIwMI=
====catalogjs annotation end====*/