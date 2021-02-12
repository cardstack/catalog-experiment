import { default as isArrayLike } from "./isArrayLike.js";
import { default as isObjectLike } from "./isObjectLike.js";
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
export { isArrayLikeObject as default };
/*====catalogjs annotation start====
k5KVwrAuL2lzQXJyYXlMaWtlLmpzA8LAlcKxLi9pc09iamVjdExpa2UuanMGwsCBp2RlZmF1bHSVoWyxaXNBcnJheUxpa2VPYmplY3QNwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmraXNBcnJheUxpa2WSAgvAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAGwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGlzT2JqZWN0TGlrZZIFCsABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEcBAeQwMIBwsDAl6FvAQAIDJDAmaFkAAoJwJMKCwnAwpmhbLFpc0FycmF5TGlrZU9iamVjdJIJDsDAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNBcnJheUxpa2VPYmplY3QuanOYoXIJEcAKkQjAwpihchMMwAuRBMDCmKFyCwvAwJEBwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAEcDAkQjAwg==
====catalogjs annotation end====*/