import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function startsWith(string, target, position) {
  string = toString(string);
  position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}
export { startsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFsqnN0YXJ0c1dpdGgVwNwAF5ehbwAAA8CRDsCZoWQJAALAkQLAwpihaaliYXNlQ2xhbXCSAhHAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYmFzZVRvU3RyaW5nkgUTwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqXRvSW50ZWdlcpIIEsACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARkHDJDAwgLCwMCZoWQJAAvAkQvAwpihaah0b1N0cmluZ5ILEMADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4UkMCZoWQAUA/AlRAREhMPwMKYoWyqc3RhcnRzV2l0aJIPFsDAwMDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zdGFydHNXaXRoLmpzmKFyCQrAEJEOwMKYoXIoCMARkQrAwpihci4JwBKRAcDCmKFyAQnAE5EHwMKYoXIqDMDAkQTAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgAKwMCRDsDC
====catalogjs annotation end====*/