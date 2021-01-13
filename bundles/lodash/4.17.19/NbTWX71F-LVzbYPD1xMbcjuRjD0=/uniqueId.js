import { default as toString } from "./toString.js";
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}
export { uniqueId as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvU3RyaW5nLmpzA8LAgadkZWZhdWx0lKFsqHVuaXF1ZUlkDcCfl6FvAAADwJEIwJmhZAkAAsCRAsDCmKFpqHRvU3RyaW5nkgILwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABQyQwJihZwABBgiQwMKZoWQEBAfAkgcFwMKYoWypaWRDb3VudGVykgcKwMDABdlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaXF1ZUlkLmpzmKFyAAnAwJEGwMKZoWQBEAnAlAoLCQbAwpihbKh1bmlxdWVJZJIJDsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy91bmlxdWVJZC5qc5ihcgkIwAqRCMDCmKFyGAnAC5EGwMKYoXILCMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAIwMCRCMDC
====catalogjs annotation end====*/