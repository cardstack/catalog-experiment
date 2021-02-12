import { default as arrayPush } from "./139.js";
import { default as getPrototype } from "./137.js";
import { default as getSymbols } from "./149.js";
import { default as stubArray } from "../stubArray.js";
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
  var result = [];

  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }

  return result;
};
export { getSymbolsIn as default };
/*====catalogjs annotation start====
k5SVwqguLzEzOS5qcwPCwJXCqC4vMTM3LmpzBsLAlcKoLi8xNDkuanMJwsCVwq8uLi9zdHViQXJyYXkuanMMwsCBp2RlZmF1bHSVoWysZ2V0U3ltYm9sc0luGsDA3AAcl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYXJyYXlQdXNokgIWwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABMBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxnZXRQcm90b3R5cGWSBRjAAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqmdldFN5bWJvbHOSCBfAAqdkZWZhdWx0wMDAmKFyCwrAwJEHwMKcoWkBEwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqXN0dWJBcnJheZILFcADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQEaCg2QwMIDwsDAl6FvAQAOGZDAmKFnAAEPEZDAwpmhZAQfEMCSEA7AwpmhbLBuYXRpdmVHZXRTeW1ib2xzkhAUwMDADpDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0U3ltYm9sc0luLmpzmKFyABDAwJEPwMKYoWcBARLAkMDCmaFkBCETwJgUFRYXGBMRD8DCmaFsrGdldFN5bWJvbHNJbpITG8DAwBGQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFN5bWJvbHNJbi5qc5ihcgAMwBSREsDCmKFyBBDAFZEPwMKYoXIDCcAWkQrAwpihckIJwBeRAcDCmKFyCQrAGJEHwMKYoXIYDMDAkQTAwpihZwEDGsCQwMKYoWcJCxvAkRvAwpihcgAMwMCREsDC
====catalogjs annotation end====*/