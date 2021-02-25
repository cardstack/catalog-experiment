import { default as arrayMap } from "./dist/98.js";
import { default as copyArray } from "./dist/117.js";
import { default as isArray } from "./isArray.js";
import { default as isSymbol } from "./isSymbol.js";
import { default as stringToPath } from "./dist/58.js";
import { default as toKey } from "./dist/27.js";
import { default as toString0 } from "./toString.js";
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }

  return isSymbol(value) ? [value] : copyArray(stringToPath(toString0(value)));
}
export { toPath as default };
/*====catalogjs annotation start====
k5eVwqwuL2Rpc3QvOTguanMDwsCVwq0uL2Rpc3QvMTE3LmpzB8LAlcKsLi9pc0FycmF5LmpzC8LAlcKtLi9pc1N5bWJvbC5qcw/CwJXCrC4vZGlzdC81OC5qcxPCwJXCrC4vZGlzdC8yNy5qcxfCwJXCrS4vdG9TdHJpbmcuanMbwsCBp2RlZmF1bHSVoWymdG9QYXRoKMDA3AAql6FvAAADwJDAmaFkCQACBJECwMKZoWmoYXJyYXlNYXCSAiHAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmpY29weUFycmF5kgYkwAGnZGVmYXVsdMDAwJihcgsJwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpp2lzQXJyYXmSCiDAAqdkZWZhdWx0wMDAmKFyCwfAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmoaXNTeW1ib2ySDiPAA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcID8DAkMDCmaFkCQASFJESwMKZoWmsc3RyaW5nVG9QYXRokhIlwASnZGVmYXVsdMDAwJihcgsMwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCA7AwJDAwpmhZAkAFhiRFsDCmaFppXRvS2V5khYiwAWnZGVmYXVsdMDAwJihcgsFwMCRFcDCnKFpAQEVG5EYwMIFwsDAmKFnCA7AwJDAwpmhZAkAGhyRGsDCmaFpqXRvU3RyaW5nMJIaJsAGp2RlZmF1bHTAwMCYoXILCcDAkRnAwpyhaQEBGR2RHMDCBsLAwJihZwgPwMCQwMKXoW8BAB4nkMCZoWQADB/AmCAhIiMkJSYfwMKZoWymdG9QYXRokh8pwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b1BhdGguanOYoXIJBsAgkR7AwpihchAHwCGRCcDCmKFyFgjAIpEBwMKYoXIIBcAjkRXAwpihchEIwCSRDcDCmKFyFAnAJZEFwMKYoXIBDMAmkRHAwpihcgEJwMCRGcDCmKFnAQMowJDAwpihZwkLKcCRKcDCmKFyAAbAwJEewMI=
====catalogjs annotation end====*/