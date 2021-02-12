import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_PARTIAL_FLAG = 32;
var partial = baseRest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
});
partial.placeholder = {};
export { partial as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJWhbKdwYXJ0aWFsHsDA3AAgl6FvAAADwJEbwJmhZAkAAsCRAsDCmaFpqGJhc2VSZXN0kgIVwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaapjcmVhdGVXcmFwkgUZwAGnZGVmYXVsdMDAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpmhaalnZXRIb2xkZXKSCBfAAqdkZWZhdWx0wMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFprnJlcGxhY2VIb2xkZXJzkgsWwAOnZGVmYXVsdMDAwJihcgsOwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4dkMCYoWcAAQ8RkMDCmaFkBAUQwJIQDsDCmaFssVdSQVBfUEFSVElBTF9GTEFHkhAawMDADpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYXJ0aWFsLmpzmKFyABHAwJEPwMKYoWcBARIbkMDCmaFkBAATwJQTERQPwMKZoWyncGFydGlhbJQTGBwfwMDAEZEb2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGFydGlhbC5qc5ihcgAHwBSREsDCmKFnAyMVwJYVFhcYGRrAwpihcgAIwBaRAcDCmKFyLQ7AF5EKwMKYoXILCcAYkQfAwpihcgEHwBmREsDCmKFyDQrAGpEEwMKYoXIHEcDAkQ/AwpihZwESHMCRHMDDmKFyAAfAwJESwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIAB8DAkRLAwg==
====catalogjs annotation end====*/