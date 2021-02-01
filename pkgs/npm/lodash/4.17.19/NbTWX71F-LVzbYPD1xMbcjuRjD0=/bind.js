import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_BIND_FLAG = 1,
    WRAP_PARTIAL_FLAG = 32;
var bind = baseRest(function (func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
export { bind as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKRiaW5kIcDcACOXoW8AAAPAkR7AmaFkCQACwJECwMKYoWmoYmFzZVJlc3SSAhfAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqY3JlYXRlV3JhcJIFHcABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaalnZXRIb2xkZXKSCBrAAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmucmVwbGFjZUhvbGRlcnOSCxnAA6dkZWZhdWx0wMCYoXILDsDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOIJDAmKFnAAEPE5DAwpmhZAQEEBGSEA7AwpihbK5XUkFQX0JJTkRfRkxBR5IQGMDAwA7ZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kLmpzmKFyAA7AwJEPwMKZoWQGBRLAkhIOwMKYoWyxV1JBUF9QQVJUSUFMX0ZMQUeSEhzAwMAO2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZC5qc5ihcgARwMCREcDCmKFnAQEUHpDAwpmhZAQAFcCVFRMWDxHAwpihbKRiaW5klBUbHyLAwMAT2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZC5qc5ihcgAEwBaRFMDCmKFnAy8XwJcXGBkaGxwdwMKYoXIACMAYkQHAwpihcjYOwBmRD8DCmKFyLg7AGpEKwMKYoXILCcAbkQfAwpihcgEEwByRFMDCmKFyExHAHZERwMKYoXIQCsDAkQTAwpihZwESH8CRH8DDmKFyAATAwJEUwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIABMDAkRTAwg==
====catalogjs annotation end====*/