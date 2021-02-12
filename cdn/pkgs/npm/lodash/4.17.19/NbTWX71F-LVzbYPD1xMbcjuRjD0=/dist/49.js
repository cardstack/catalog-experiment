import { default as identity } from "../identity.js";
import { default as overRest } from "./110.js";
import { default as setToString } from "./51.js";
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}
export { baseRest as default };
/*====catalogjs annotation start====
k5OVwq4uLi9pZGVudGl0eS5qcwPCwJXCqC4vMTEwLmpzBsLAlcKnLi81MS5qcwnCwIGnZGVmYXVsdJWhbKhiYXNlUmVzdBHAwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGlkZW50aXR5kgIPwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABkBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahvdmVyUmVzdJIFDsABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQETBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmrc2V0VG9TdHJpbmeSCA3AAqdkZWZhdWx0wMDAmKFyCwvAwJEHwMKcoWkBEgcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmaFsqGJhc2VSZXN0kgwSwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVJlc3QuanOYoXIJCMANkQvAwpihchkLwA6RB8DCmKFyAQjAD5EEwMKYoXIOCMDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAIwMCRC8DC
====catalogjs annotation end====*/