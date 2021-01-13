import { default as baseExtremum } from "./dist/28.js";
import { default as baseLt } from "./dist/166.js";
import { default as identity } from "./identity.js";
function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}
export { min as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY2LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKNtaW4RwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmmYmFzZUx0kgUPwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqGlkZW50aXR5kggOwAKnZGVmYXVsdMDAmKFyCwjAwJEHwMKcoWkBGAcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmKFso21pbpIMEsDAwMDZQ1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9taW4uanOYoXIJA8ANkQvAwpihcisMwA6RAcDCmKFyCAjAD5EHwMKYoXICBsDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgADwMCRC8DC
====catalogjs annotation end====*/