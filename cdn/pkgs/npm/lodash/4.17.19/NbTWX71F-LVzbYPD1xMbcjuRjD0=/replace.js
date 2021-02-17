import { default as toString0 } from "./toString.js";
function replace() {
  var args = arguments,
      string = toString0(args[0]);
  return args.length < 3 ? string : string.replace(args[1], args[2]);
}
export { replace as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0laFsp3JlcGxhY2UKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmpdG9TdHJpbmcwkgIIwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA/AwJDAwpehbwEABgmQwJmhZABSB8CSCAfAwpmhbKdyZXBsYWNlkgcLwMDAwJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXBsYWNlLmpzmKFyCQfACJEGwMKYoXIsCcDAkQHAwpihZwEDCsCQwMKYoWcJCwvAkQvAwpihcgAHwMCRBsDC
====catalogjs annotation end====*/