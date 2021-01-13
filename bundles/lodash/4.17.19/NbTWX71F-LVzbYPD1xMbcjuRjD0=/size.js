import { default as baseKeys } from "./dist/132.js";
import { default as getTag } from "./dist/45.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as stringSize } from "./dist/144.js";
var mapTag = '[object Map]',
    setTag = '[object Set]';
function size(collection) {
  if (collection == null) {
    return 0;
  }

  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }

  var tag = getTag(collection);

  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }

  return baseKeys(collection).length;
}
export { size as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTMyLmpzA8LAlcKsLi9kaXN0LzQ1LmpzBsLAlcKwLi9pc0FycmF5TGlrZS5qcwnCwJXCrS4vaXNTdHJpbmcuanMMwsCVwq0uL2Rpc3QvMTQ0LmpzD8LAgadkZWZhdWx0lKFspHNpemUgwNwAIpehbwAAA8CRFsCZoWQJAALAkQLAwpihaahiYXNlS2V5c5ICHsAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaZnZXRUYWeSBRvAAadkZWZhdWx0wMCYoXILBsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmraXNBcnJheUxpa2WSCBjAAqdkZWZhdWx0wMCYoXILC8DAkQfAwpyhaQEbBwyQwMICwsDAmaFkCQALwJELwMKYoWmoaXNTdHJpbmeSCxnAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEYCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmqc3RyaW5nU2l6ZZIOGsAEp2RlZmF1bHTAwJihcgsKwMCRDcDCnKFpARgNEJDAwgTCwMCXoW8BABEfkMCYoWcAARIWkMDCmaFkBBETFJITEcDCmKFspm1hcFRhZ5ITHMDAwBHZRFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zaXplLmpzmKFyAAbAwJESwMKZoWQGERXAkhURwMKYoWymc2V0VGFnkhUdwMDAEdlEV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NpemUuanOYoXIABsDAkRTAwpmhZAEWF8CaGBkaGxwdHhcSFMDCmKFspHNpemWSFyHAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2l6ZS5qc5ihcgkEwBiRFsDCmKFyRAvAGZEHwMKYoXIbCMAakQrAwpihcg8KwBuRDcDCmKFyMwbAHJEEwMKYoXIcBsAdkRLAwpihcgsGwB6RFMDCmKFyLgjAwJEBwMKYoWcBAyDAkMDCmKFnCQshwJEhwMKYoXIABMDAkRbAwg==
====catalogjs annotation end====*/