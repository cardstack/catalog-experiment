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
k5GVwqwuL2Rpc3QvMjMuanMDwsCBp2RlZmF1bHSVoWylY3VycnkRwMDcABOXoW8AAAPAkQ7AmaFkCQACBJECwMKZoWmqY3JlYXRlV3JhcJICC8AAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgOwMCQwMKXoW8BAAYQkMCYoWcAAQcJkMDCmaFkBAQIwJIIBsDCmaFsr1dSQVBfQ1VSUllfRkxBR5IIDMDAwAaQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY3VycnkuanOYoXIAD8DAkQfAwpmhZAEgCg6VCwwKDQfAwpmhbKVjdXJyeZQKDQ8SwMDAwJEO2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY3VycnkuanOYoXIJBcALkQnAwpihcksKwAyRAcDCmKFyBw/ADZEHwMKYoXJYBcDAkQnAwpihZwESD8CRD8DDmKFyAAXAwJEJwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABcDAkQnAwg==
====catalogjs annotation end====*/