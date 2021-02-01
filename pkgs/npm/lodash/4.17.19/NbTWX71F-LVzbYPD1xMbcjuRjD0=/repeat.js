import { default as baseRepeat } from "./dist/169.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
function repeat(string, n, guard) {
  if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  return baseRepeat(toString(string), n);
}
export { repeat as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTY5LmpzA8LAlcKsLi9kaXN0LzcwLmpzBsLAlcKuLi90b0ludGVnZXIuanMJwsCVwq0uL3RvU3RyaW5nLmpzDMLAgadkZWZhdWx0lKFspnJlcGVhdBXA3AAXl6FvAAADwJDAmaFkCQACwJECwMKYoWmqYmFzZVJlcGVhdJICEsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa5pc0l0ZXJhdGVlQ2FsbJIFEMABp2RlZmF1bHTAwJihcgsOwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaal0b0ludGVnZXKSCBHAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEZBwyQwMICwsDAmaFkCQALwJELwMKYoWmodG9TdHJpbmeSCxPAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOFJDAmaFkAA8PwJUQERITD8DCmKFspnJlcGVhdJIPFsDAwMDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9yZXBlYXQuanOYoXIJBsAQkQ7AwpihciMOwBGRBMDCmKFyRgnAEpEHwMKYoXITCsATkQHAwpihcgEIwMCRCsDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAbAwJEOwMI=
====catalogjs annotation end====*/