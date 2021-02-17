import { default as toFinite } from "./toFinite.js";
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
export { toInteger as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvRmluaXRlLmpzA8LAgadkZWZhdWx0laFsqXRvSW50ZWdlcgrAwJyXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaah0b0Zpbml0ZZICCMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgPwMCQwMKXoW8BAAYJkMCZoWQAcgfAkggHwMKZoWypdG9JbnRlZ2VykgcLwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0ludGVnZXIuanOYoXIJCcAIkQbAwpihchkIwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyAAnAwJEGwMI=
====catalogjs annotation end====*/