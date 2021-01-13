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
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSUoWylY3VycnkQwNwAEpehbwAAA8CSCA3AmaFkCQACwJECwMKYoWmqY3JlYXRlV3JhcJICCsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUPkMCYoWcAAQYIkMDCmaFkBAQHwJMHBQ3AwpihbK9XUkFQX0NVUlJZX0ZMQUeSBwvAwMAF2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY3VycnkuanOYoXIAD8DAkQbAwpmhZAEgCQ2WCgsJDAYNwMKYoWylY3VycnmUCQwOEcDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jdXJyeS5qc5ihcgkFwAqRCMDCmKFySwrAC5EBwMKYoXIHD8AMkQbAwpihclgFwMCRCMDCmKFnARIOwJEOwMOYoXIABcDAkQjAwpihZwEDEMCQwMKYoWcJCxHAkRHAwpihcgAFwMCRCMDC
====catalogjs annotation end====*/