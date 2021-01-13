import { default as isArrayLike } from "./isArrayLike.js";
import { default as isObjectLike } from "./isObjectLike.js";
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
export { isArrayLikeObject as default };
/*====catalogjs annotation start====
k5KVwrAuL2lzQXJyYXlMaWtlLmpzA8LAlcKxLi9pc09iamVjdExpa2UuanMGwsCBp2RlZmF1bHSUoWyxaXNBcnJheUxpa2VPYmplY3QNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmraXNBcnJheUxpa2WSAgvAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAbAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsaXNPYmplY3RMaWtlkgUKwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBHAQHkMDCAcLAwJehbwEACAyQwJmhZAAKCcCTCgsJwMKYoWyxaXNBcnJheUxpa2VPYmplY3SSCQ7AwMDA2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNBcnJheUxpa2VPYmplY3QuanOYoXIJEcAKkQjAwpihchMMwAuRBMDCmKFyCwvAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAEcDAkQjAwg==
====catalogjs annotation end====*/