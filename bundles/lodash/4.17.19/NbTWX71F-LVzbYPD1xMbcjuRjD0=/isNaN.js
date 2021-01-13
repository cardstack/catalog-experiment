import { default as isNumber } from "./isNumber.js";
function isNaN(value) {
  return isNumber(value) && value != +value;
}
export { isNaN as default };
/*====catalogjs annotation start====
k5GVwq0uL2lzTnVtYmVyLmpzA8LAgadkZWZhdWx0lKFspWlzTmFOCcCbl6FvAAADwJEFwJmhZAkAAsCRAsDCmKFpqGlzTnVtYmVykgIHwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAGAEEkMDCAMLAwJehbwEABQiQwJmhZAAdBsCSBwbAwpihbKVpc05hTpIGCsDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc05hTi5qc5ihcgkFwAeRBcDCmKFyEwjAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIABcDAkQXAwg==
====catalogjs annotation end====*/