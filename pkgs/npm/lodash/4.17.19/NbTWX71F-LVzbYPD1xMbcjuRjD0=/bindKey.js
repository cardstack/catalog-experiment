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
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKdiaW5kS2V5JMDcACaXoW8AAAPAkSHAmaFkCQACwJECwMKYoWmoYmFzZVJlc3SSAhnAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqY3JlYXRlV3JhcJIFIMABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARcECZDAwgHCwMCZoWQJAAjAkQjAwpihaalnZXRIb2xkZXKSCB3AAqdkZWZhdWx0wMCYoXILCcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmucmVwbGFjZUhvbGRlcnOSCxzAA6dkZWZhdWx0wMCYoXILDsDAkQrAwpyhaQEYCg2QwMIDwsDAl6FvAQAOI5DAmKFnAAEPFZDAwpmhZAQEEBGSEA7AwpihbK5XUkFQX0JJTkRfRkxBR5IQGsDAwA7ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kS2V5LmpzmKFyAA7AwJEPwMKZoWQGBBITkhIOwMKYoWyyV1JBUF9CSU5EX0tFWV9GTEFHkhIbwMDADtlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIAEsDAkRHAwpmhZAYFFMCSFA7AwpihbLFXUkFQX1BBUlRJQUxfRkxBR5IUH8DAwA7ZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kS2V5LmpzmKFyABHAwJETwMKYoWcBARYhkMDCmaFkBAAXwJYXFRgPERPAwpihbKdiaW5kS2V5lBceIiXAwMAV2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZEtleS5qc5ihcgAHwBiRFsDCmKFnAy0ZwJgZGhscHR4fIMDCmKFyAAjAGpEBwMKYoXI0DsAbkQ/AwpihcgMSwByREcDCmKFyLg7AHZEKwMKYoXILCcAekQfAwpihcgEHwB+RFsDCmKFyExHAIJETwMKYoXIQCsDAkQTAwpihZwESIsCRIsDDmKFyAAfAwJEWwMKYoWcBAyTAkMDCmKFnCQslwJElwMKYoXIAB8DAkRbAwg==
====catalogjs annotation end====*/