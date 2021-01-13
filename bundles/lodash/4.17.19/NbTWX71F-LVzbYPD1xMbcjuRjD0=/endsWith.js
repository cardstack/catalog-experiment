import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);
  var length = string.length;
  position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}
export { endsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFsqGVuZHNXaXRoFcDcABeXoW8AAAPAkQ7AmaFkCQACwJECwMKYoWmpYmFzZUNsYW1wkgISwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGJhc2VUb1N0cmluZ5IFEcABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBPAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwyQwMICwsDAmaFkCQALwJELwMKYoWmodG9TdHJpbmeSCxDAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOFJDAmaFkAMyND8CVEBESEw/AwpihbKhlbmRzV2l0aJIPFsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9lbmRzV2l0aC5qc5ihcgkIwBCRDsDCmKFyKAjAEZEKwMKYoXIVDMASkQTAwpihclcJwBORAcDCmKFyAQnAwJEHwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIACMDAkQ7Awg==
====catalogjs annotation end====*/