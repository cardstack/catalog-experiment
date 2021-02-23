import { default as copyObject } from "./dist/54.js";
import { default as keysIn } from "./keysIn.js";
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}
export { toPlainObject as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTQuanMDwsCVwqsuL2tleXNJbi5qcwfCwIGnZGVmYXVsdJWhbK10b1BsYWluT2JqZWN0D8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmqY29weU9iamVjdJICDMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaZrZXlzSW6SBg3AAadkZWZhdWx0wMDAmKFyCwbAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDcDAkMDCl6FvAQAKDpDAmaFkAAsLwJMMDQvAwpmhbK10b1BsYWluT2JqZWN0kgsQwMDAwJDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b1BsYWluT2JqZWN0LmpzmKFyCQ3ADJEKwMKYoXITCsANkQHAwpihcggGwMCRBcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAA3AwJEKwMI=
====catalogjs annotation end====*/