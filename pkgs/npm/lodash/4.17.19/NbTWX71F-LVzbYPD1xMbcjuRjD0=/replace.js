import { default as toString } from "./toString.js";
function replace() {
  var args = arguments,
      string = toString(args[0]);
  return args.length < 3 ? string : string.replace(args[1], args[2]);
}
export { replace as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFsp3JlcGxhY2UJwJuXoW8AAAPAkMCZoWQJAALAkQLAwpihaah0b1N0cmluZ5ICB8AAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAUIkMCZoWQAUgbAkgcGwMKYoWyncmVwbGFjZZIGCsDAwMDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXBsYWNlLmpzmKFyCQfAB5EFwMKYoXIsCMDAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAHwMCRBcDC
====catalogjs annotation end====*/