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
k5WVwq0uL2Rpc3QvMTMyLmpzA8LAlcKsLi9kaXN0LzQ1LmpzB8LAlcKwLi9pc0FycmF5TGlrZS5qcwvCwJXCrS4vaXNTdHJpbmcuanMPwsCVwq0uL2Rpc3QvMTQ0LmpzE8LAgadkZWZhdWx0laFspHNpemUlwMDcACeXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahiYXNlS2V5c5ICI8AAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaaZnZXRUYWeSBiDAAadkZWZhdWx0wMDAmKFyCwbAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmraXNBcnJheUxpa2WSCh3AAqdkZWZhdWx0wMDAmKFyCwvAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIEsDAkMDCmaFkCQAOEJEOwMKZoWmoaXNTdHJpbmeSDh7AA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcID8DAkMDCmaFkCQASFJESwMKZoWmqc3RyaW5nU2l6ZZISH8AEp2RlZmF1bHTAwMCYoXILCsDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgPwMCQwMKXoW8BABYkkMCYoWcAARcbkMDCmaFkBBEYGZIYFsDCmaFspm1hcFRhZ5IYIcDAwBaQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2l6ZS5qc5ihcgAGwMCRF8DCmaFkBhEawJIaFsDCmaFspnNldFRhZ5IaIsDAwBaQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2l6ZS5qc5ihcgAGwMCRGcDCmaFkARYcwJodHh8gISIjHBcZwMKZoWykc2l6ZZIcJsDAwMCQ2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2l6ZS5qc5ihcgkEwB2RG8DCmKFyRAvAHpEJwMKYoXIbCMAfkQ3Awpihcg8KwCCREcDCmKFyMwbAIZEFwMKYoXIcBsAikRfAwpihcgsGwCORGcDCmKFyLgjAwJEBwMKYoWcBAyXAkMDCmKFnCQsmwJEmwMKYoXIABMDAkRvAwg==
====catalogjs annotation end====*/