import { default as toString } from "./toString.js";
import { default as upperFirst } from "./upperFirst.js";
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}
export { capitalize as default };
/*====catalogjs annotation start====
k5KVwq0uL3RvU3RyaW5nLmpzA8LAlcKvLi91cHBlckZpcnN0LmpzBsLAgadkZWZhdWx0lKFsqmNhcGl0YWxpemUNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaah0b1N0cmluZ5ICC8AAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaap1cHBlckZpcnN0kgUKwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBGgQHkMDCAcLAwJehbwEACAyQwJmhZAAaCcCTCgsJwMKYoWyqY2FwaXRhbGl6ZZIJDsDAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jYXBpdGFsaXplLmpzmKFyCQrACpEIwMKYoXIUCsALkQTAwpihcgEIwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAArAwJEIwMI=
====catalogjs annotation end====*/