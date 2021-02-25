import { default as baseClamp } from "./dist/148.js";
import { default as baseToString } from "./dist/22.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
function endsWith(string, target, position) {
  string = toString0(string);
  target = baseToString(target);
  var length = string.length;
  position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}
export { endsWith as default };
/*====catalogjs annotation start====
k5SVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKsLi9kaXN0LzIyLmpzB8LAlcKuLi90b0ludGVnZXIuanMLwsCVwq0uL3RvU3RyaW5nLmpzD8LAgadkZWZhdWx0laFsqGVuZHNXaXRoGcDA3AAbl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYmFzZUNsYW1wkgIWwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprGJhc2VUb1N0cmluZ5IGFcABp2RlZmF1bHTAwMCYoXILDMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaal0b0ludGVnZXKSChfAAqdkZWZhdWx0wMDAmKFyCwnAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIEMDAkMDCmaFkCQAOEJEOwMKZoWmpdG9TdHJpbmcwkg4UwAOnZGVmYXVsdMDAwJihcgsJwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA/AwJDAwpehbwEAEhiQwJmhZADMjRPAlRQVFhcTwMKZoWyoZW5kc1dpdGiSExrAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2VuZHNXaXRoLmpzmKFyCQjAFJESwMKYoXIoCcAVkQ3AwpihchUMwBaRBcDCmKFyVwnAF5EBwMKYoXIBCcDAkQnAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAIwMCREsDC
====catalogjs annotation end====*/