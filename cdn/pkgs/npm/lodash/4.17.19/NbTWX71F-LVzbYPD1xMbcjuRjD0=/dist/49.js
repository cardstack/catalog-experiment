import { default as identity } from "../identity.js";
import { default as overRest } from "./110.js";
import { default as setToString } from "./51.js";
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}
export { baseRest as default };
/*====catalogjs annotation start====
k5OVwq4uLi9pZGVudGl0eS5qcwPCwJXCqC4vMTEwLmpzB8LAlcKnLi81MS5qcwvCwIGnZGVmYXVsdJWhbKhiYXNlUmVzdBTAwNwAFpehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGlkZW50aXR5kgISwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCBDAwJDAwpmhZAkABgiRBsDCmaFpqG92ZXJSZXN0kgYRwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCArAwJDAwpmhZAkACgyRCsDCmaFpq3NldFRvU3RyaW5nkgoQwAKnZGVmYXVsdMDAwJihcgsLwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCAnAwJDAwpehbwEADhOQwJmhZAAQD8CUEBESD8DCmaFsqGJhc2VSZXN0kg8VwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVJlc3QuanOYoXIJCMAQkQ7AwpihchkLwBGRCcDCmKFyAQjAEpEFwMKYoXIOCMDAkQHAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAIwMCRDsDC
====catalogjs annotation end====*/