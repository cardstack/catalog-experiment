import { default as lodash } from "./wrapperLodash.js";
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}
export { chain as default };
/*====catalogjs annotation start====
k5GVwrIuL3dyYXBwZXJMb2Rhc2guanMDwsCBp2RlZmF1bHSUoWylY2hhaW4JwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmmbG9kYXNokgIHwACnZGVmYXVsdMDAmKFyCwbAwJEBwMKcoWkAHQEEkMDCAMLAwJehbwEABQiQwJmhZAA2BsCSBwbAwpihbKVjaGFpbpIGCsDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jaGFpbi5qc5ihcgkFwAeRBcDCmKFyGQbAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIABcDAkQXAwg==
====catalogjs annotation end====*/