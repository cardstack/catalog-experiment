import { default as LazyWrapper } from "./103.js";
import { default as arrayPush } from "./139.js";
import { default as arrayReduce } from "./146.js";
function baseWrapperValue(value, actions) {
  var result = value;

  if (result instanceof LazyWrapper) {
    result = result.value();
  }

  return arrayReduce(actions, function (result, action) {
    return action.func.apply(action.thisArg, arrayPush([result], action.args));
  }, result);
}
export { baseWrapperValue as default };
/*====catalogjs annotation start====
k5OVwqguLzEwMy5qcwPCwJXCqC4vMTM5LmpzB8LAlcKoLi8xNDYuanMLwsCBp2RlZmF1bHSVoWywYmFzZVdyYXBwZXJWYWx1ZRTAwNwAFpehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq0xhenlXcmFwcGVykgIQwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFpqWFycmF5UHVzaJIGEsABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaathcnJheVJlZHVjZZIKEcACp2RlZmF1bHTAwMCYoXILC8DAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgKwMCQwMKXoW8BAA4TkMCZoWQAKQ/AlBAREg/AwpmhbLBiYXNlV3JhcHBlclZhbHVlkg8VwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVdyYXBwZXJWYWx1ZS5qc5ihcgkQwBCRDsDCmKFyQgvAEZEBwMKYoXIvC8ASkQnAwpihclMJwMCRBcDCmKFnAQMUwJDAwpihZwkLFcCRFcDCmKFyABDAwJEOwMI=
====catalogjs annotation end====*/