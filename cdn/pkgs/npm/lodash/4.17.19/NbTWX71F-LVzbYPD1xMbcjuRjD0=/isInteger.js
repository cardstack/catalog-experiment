import { default as toInteger } from "./toInteger.js";
function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}
export { isInteger as default };
/*====catalogjs annotation start====
k5GVwq4uL3RvSW50ZWdlci5qcwPCwIGnZGVmYXVsdJWhbKlpc0ludGVnZXIJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmpdG9JbnRlZ2VykgIHwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABkBBJDAwgDCwMCXoW8BAAUIkMCZoWQACgbAkgcGwMKZoWypaXNJbnRlZ2VykgYKwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0ludGVnZXIuanOYoXIJCcAHkQXAwpihcjgJwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAnAwJEFwMI=
====catalogjs annotation end====*/