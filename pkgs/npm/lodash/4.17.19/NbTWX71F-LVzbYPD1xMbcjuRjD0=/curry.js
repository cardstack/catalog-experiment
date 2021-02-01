import { default as createWrap } from "./dist/23.js";
var WRAP_CURRY_FLAG = 8;
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}
curry.placeholder = {};
export { curry as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSUoWylY3VycnkQwNwAEpehbwAAA8CRDcCZoWQJAALAkQLAwpihaapjcmVhdGVXcmFwkgIKwACnZGVmYXVsdMDAmKFyCwrAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQ+QwJihZwABBgiQwMKZoWQEBAfAkgcFwMKYoWyvV1JBUF9DVVJSWV9GTEFHkgcLwMDABdlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2N1cnJ5LmpzmKFyAA/AwJEGwMKZoWQBIAkNlQoLCQwGwMKYoWylY3VycnmUCQwOEcDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jdXJyeS5qc5ihcgkFwAqRCMDCmKFySwrAC5EBwMKYoXIHD8AMkQbAwpihclgFwMCRCMDCmKFnARIOwJEOwMOYoXIABcDAkQjAwpihZwEDEMCQwMKYoWcJCxHAkRHAwpihcgAFwMCRCMDC
====catalogjs annotation end====*/