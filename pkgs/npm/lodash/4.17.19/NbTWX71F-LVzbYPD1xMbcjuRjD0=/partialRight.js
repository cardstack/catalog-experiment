import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_PARTIAL_RIGHT_FLAG = 64;
var partialRight = baseRest(function (func, partials) {
  var holders = replaceHolders(partials, getHolder(partialRight));
  return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
});
partialRight.placeholder = {};
export { partialRight as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKxwYXJ0aWFsUmlnaHQewNwAIJehbwAAA8CRG8CZoWQJAALAkQLAwpihaahiYXNlUmVzdJICFcAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaapjcmVhdGVXcmFwkgUZwAGnZGVmYXVsdMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqWdldEhvbGRlcpIIF8ACp2RlZmF1bHTAwJihcgsJwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaa5yZXBsYWNlSG9sZGVyc5ILFsADp2RlZmF1bHTAwJihcgsOwMCRCsDCnKFpARgKDZDAwgPCwMCXoW8BAA4dkMCYoWcAAQ8RkMDCmaFkBAUQwJIQDsDCmKFst1dSQVBfUEFSVElBTF9SSUdIVF9GTEFHkhAawMDADtlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnRpYWxSaWdodC5qc5ihcgAXwMCRD8DCmKFnAQESG5DAwpmhZAQAE8CUExEUD8DCmKFsrHBhcnRpYWxSaWdodJQTGBwfwMDAEdlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnRpYWxSaWdodC5qc5ihcgAMwBSREsDCmKFnAyMVwJYVFhcYGRrAwpihcgAIwBaRAcDCmKFyLQ7AF5EKwMKYoXILCcAYkQfAwpihcgEMwBmREsDCmKFyDQrAGpEEwMKYoXIHF8DAkQ/AwpihZwESHMCRHMDDmKFyAAzAwJESwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIADMDAkRLAwg==
====catalogjs annotation end====*/