import { default as createWrap } from "./dist/23.js";
var WRAP_CURRY_RIGHT_FLAG = 16;
function curryRight(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curryRight.placeholder;
  return result;
}
curryRight.placeholder = {};
export { curryRight as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSVoWyqY3VycnlSaWdodBHAwNwAE5ehbwAAA8CRDsCZoWQJAAIEkQLAwpmhaapjcmVhdGVXcmFwkgILwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABhCQwJihZwABBwmQwMKZoWQEBQjAkggGwMKZoWy1V1JBUF9DVVJSWV9SSUdIVF9GTEFHkggMwMDABpDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jdXJyeVJpZ2h0LmpzmKFyABXAwJEHwMKZoWQBIAoOlQsMCg0HwMKZoWyqY3VycnlSaWdodJQKDQ8SwMDAwJEO2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY3VycnlSaWdodC5qc5ihcgkKwAuRCcDCmKFySwrADJEBwMKYoXIHFcANkQfAwpihclgKwMCRCcDCmKFnARIPwJEPwMOYoXIACsDAkQnAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAKwMCRCcDC
====catalogjs annotation end====*/