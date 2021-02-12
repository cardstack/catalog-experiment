import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_PARTIAL_FLAG = 32;
var bindKey = baseRest(function (object, key, partials) {
  var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bindKey));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(key, bitmask, object, partials, holders);
});
bindKey.placeholder = {};
export { bindKey as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJWhbKdiaW5kS2V5JMDA3AAml6FvAAADwJEhwJmhZAkAAsCRAsDCmaFpqGJhc2VSZXN0kgIZwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaapjcmVhdGVXcmFwkgUgwAGnZGVmYXVsdMDAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaalnZXRIb2xkZXKSCB3AAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFprnJlcGxhY2VIb2xkZXJzkgscwAOnZGVmYXVsdMDAwJihcgsOwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4jkMCYoWcAAQ8VkMDCmaFkBAQQEZIQDsDCmaFsrldSQVBfQklORF9GTEFHkhAawMDADpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kS2V5LmpzmKFyAA7AwJEPwMKZoWQGBBITkhIOwMKZoWyyV1JBUF9CSU5EX0tFWV9GTEFHkhIbwMDADpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kS2V5LmpzmKFyABLAwJERwMKZoWQGBRTAkhQOwMKZoWyxV1JBUF9QQVJUSUFMX0ZMQUeSFB/AwMAOkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIAEcDAkRPAwpihZwEBFiGQwMKZoWQEABfAlhcVGA8RE8DCmaFsp2JpbmRLZXmUFx4iJcDAwBWRIdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIAB8AYkRbAwpihZwMtGcCYGRobHB0eHyDAwpihcgAIwBqRAcDCmKFyNA7AG5EPwMKYoXIDEsAckRHAwpihci4OwB2RCsDCmKFyCwnAHpEHwMKYoXIBB8AfkRbAwpihchMRwCCRE8DCmKFyEArAwJEEwMKYoWcBEiLAkSLAw5ihcgAHwMCRFsDCmKFnAQMkwJDAwpihZwkLJcCRJcDCmKFyAAfAwJEWwMI=
====catalogjs annotation end====*/