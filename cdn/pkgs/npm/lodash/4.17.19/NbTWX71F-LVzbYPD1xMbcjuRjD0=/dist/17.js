import { default as isArray } from "../isArray.js";
import { default as isKey } from "./26.js";
import { default as stringToPath } from "./58.js";
import { default as toString0 } from "../toString.js";
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }

  return isKey(value, object) ? [value] : stringToPath(toString0(value));
}
export { castPath as default };
/*====catalogjs annotation start====
k5SVwq0uLi9pc0FycmF5LmpzA8LAlcKnLi8yNi5qcwbCwJXCpy4vNTguanMJwsCVwq4uLi90b1N0cmluZy5qcwzCwIGnZGVmYXVsdJWhbKhjYXN0UGF0aBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2lzQXJyYXmSAhDAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFppWlzS2V5kgURwAGnZGVmYXVsdMDAwJihcgsFwMCRBMDCnKFpARIECZDAwgHCwMCZoWQJAAjAkQjAwpmhaaxzdHJpbmdUb1BhdGiSCBLAAqdkZWZhdWx0wMDAmKFyCwzAwJEHwMKcoWkBEgcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqXRvU3RyaW5nMJILE8ADp2RlZmF1bHTAwMCYoXILCcDAkQrAwpyhaQEZCg2QwMIDwsDAl6FvAQAOFJDAmaFkAAsPwJUQERITD8DCmaFsqGNhc3RQYXRokg8WwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY2FzdFBhdGguanOYoXIJCMAQkQ7AwpihchgHwBGRAcDCmKFyKwXAEpEEwMKYoXIcDMATkQfAwpihcgEJwMCRCsDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAjAwJEOwMI=
====catalogjs annotation end====*/