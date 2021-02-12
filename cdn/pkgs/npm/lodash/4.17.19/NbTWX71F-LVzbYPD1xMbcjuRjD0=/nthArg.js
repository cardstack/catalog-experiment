import { default as baseNth } from "./dist/127.js";
import { default as baseRest } from "./dist/49.js";
import { default as toInteger } from "./toInteger.js";
function nthArg(n) {
  n = toInteger(n);
  return baseRest(function (args) {
    return baseNth(args, n);
  });
}
export { nthArg as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTI3LmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCBp2RlZmF1bHSVoWymbnRoQXJnEcDA3AATl6FvAAADwJDAmaFkCQACwJECwMKZoWmnYmFzZU50aJICD8AAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYmFzZVJlc3SSBQ7AAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqXRvSW50ZWdlcpIIDcACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEZBwqQwMICwsDAl6FvAQALEJDAmaFkABIMwJQNDg8MwMKZoWymbnRoQXJnkgwSwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9udGhBcmcuanOYoXIJBsANkQvAwpihcgwJwA6RB8DCmKFyDgjAD5EEwMKYoXIeB8DAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAGwMCRC8DC
====catalogjs annotation end====*/