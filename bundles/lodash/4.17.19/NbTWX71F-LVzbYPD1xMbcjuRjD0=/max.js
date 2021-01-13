import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as identity } from "./identity.js";
function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}
export { max as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKNtYXgRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmmYmFzZUd0kgUPwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqGlkZW50aXR5kggOwAKnZGVmYXVsdMDAmKFyCwjAwJEHwMKcoWkBGAcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmKFso21heJIMEsDAwMDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXguanOYoXIJA8ANkQvAwpihcisMwA6RAcDCmKFyCAjAD5EHwMKYoXICBsDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgADwMCRC8DC
====catalogjs annotation end====*/