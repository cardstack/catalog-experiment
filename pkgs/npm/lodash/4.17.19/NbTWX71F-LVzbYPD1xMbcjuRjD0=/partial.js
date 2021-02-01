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
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKdwYXJ0aWFsHsDcACCXoW8AAAPAkRvAmaFkCQACwJECwMKYoWmoYmFzZVJlc3SSAhXAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqY3JlYXRlV3JhcJIFGcABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaalnZXRIb2xkZXKSCBfAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmucmVwbGFjZUhvbGRlcnOSCxbAA6dkZWZhdWx0wMCYoXILDsDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOHZDAmKFnAAEPEZDAwpmhZAQFEMCSEA7AwpihbLFXUkFQX1BBUlRJQUxfRkxBR5IQGsDAwA7ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9wYXJ0aWFsLmpzmKFyABHAwJEPwMKYoWcBARIbkMDCmaFkBAATwJQTERQPwMKYoWyncGFydGlhbJQTGBwfwMDAEdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3BhcnRpYWwuanOYoXIAB8AUkRLAwpihZwMjFcCWFRYXGBkawMKYoXIACMAWkQHAwpihci0OwBeRCsDCmKFyCwnAGJEHwMKYoXIBB8AZkRLAwpihcg0KwBqRBMDCmKFyBxHAwJEPwMKYoWcBEhzAkRzAw5ihcgAHwMCREsDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAfAwJESwMI=
====catalogjs annotation end====*/