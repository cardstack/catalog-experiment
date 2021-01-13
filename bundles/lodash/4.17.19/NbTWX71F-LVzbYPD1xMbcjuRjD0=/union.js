import { default as baseFlatten } from "./dist/85.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
var union = baseRest(function (arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
export { union as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODUuanMDwsCVwqwuL2Rpc3QvNDkuanMGwsCVwqwuL2Rpc3QvNjMuanMJwsCVwrYuL2lzQXJyYXlMaWtlT2JqZWN0LmpzDMLAgadkZWZhdWx0lKFspXVuaW9uF8DcABmXoW8AAAPAkQ/AmaFkCQACwJECwMKYoWmrYmFzZUZsYXR0ZW6SAhTAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoYmFzZVJlc3SSBRLAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoYmFzZVVuaXGSCBPAAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmxaXNBcnJheUxpa2VPYmplY3SSCxXAA6dkZWZhdWx0wMCYoXILEcDAkQrAwpyhaQEhCg2QwMIDwsDAl6FvAQAOFpDAmKFnAAEPwJDAwpmhZAQAEMCTEA4RwMKYoWyldW5pb26SEBjAwMAO2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pb24uanOYoXIABcARkQ/AwpihZwMMEsCVEhMUFQ/AwpihcgAIwBORBMDCmKFyHgjAFJEHwMKYoXIBC8AVkQHAwpihcgwRwMCRCsDCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAAXAwJEPwMI=
====catalogjs annotation end====*/