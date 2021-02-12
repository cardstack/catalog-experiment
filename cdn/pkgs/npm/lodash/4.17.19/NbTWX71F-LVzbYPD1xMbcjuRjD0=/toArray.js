import { default as Symbol0 } from "./dist/87.js";
import { default as copyArray } from "./dist/117.js";
import { default as getTag } from "./dist/45.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as mapToArray } from "./dist/153.js";
import { default as setToArray } from "./dist/154.js";
import { default as stringToArray } from "./dist/143.js";
import { default as values } from "./values.js";
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }

  return result;
}
var mapTag = '[object Map]',
    setTag = '[object Set]';
var symIterator = Symbol0 ? Symbol0.iterator : undefined;
function toArray(value) {
  if (!value) {
    return [];
  }

  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }

  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }

  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
  return func(value);
}
export { toArray as default };
/*====catalogjs annotation start====
k5mVwqwuL2Rpc3QvODcuanMDwsCVwq0uL2Rpc3QvMTE3LmpzBsLAlcKsLi9kaXN0LzQ1LmpzCcLAlcKwLi9pc0FycmF5TGlrZS5qcwzCwJXCrS4vaXNTdHJpbmcuanMPwsCVwq0uL2Rpc3QvMTUzLmpzEsLAlcKtLi9kaXN0LzE1NC5qcxXCwJXCrS4vZGlzdC8xNDMuanMYwsCVwqsuL3ZhbHVlcy5qcxvCwIGnZGVmYXVsdJWhbKd0b0FycmF5O8DA3AA9l6FvAAADwJDAmaFkCQACwJECwMKZoWmnU3ltYm9sMJMCKCnAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqWNvcHlBcnJheZIFL8ABp2RlZmF1bHTAwMCYoXILCcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmmZ2V0VGFnkgg0wAKnZGVmYXVsdMDAwJihcgsGwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaatpc0FycmF5TGlrZZILLMADp2RlZmF1bHTAwMCYoXILC8DAkQrAwpyhaQEbCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmoaXNTdHJpbmeSDi3ABKdkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmaFpqm1hcFRvQXJyYXmSETbABadkZWZhdWx0wMDAmKFyCwrAwJEQwMKcoWkBGBAVkMDCBcLAwJmhZAkAFMCRFMDCmaFpqnNldFRvQXJyYXmSFDjABqdkZWZhdWx0wMDAmKFyCwrAwJETwMKcoWkBGBMYkMDCBsLAwJmhZAkAF8CRF8DCmaFprXN0cmluZ1RvQXJyYXmSFy7AB6dkZWZhdWx0wMDAmKFyCw3AwJEWwMKcoWkBGBYbkMDCB8LAwJmhZAkAGsCRGsDCmaFppnZhbHVlc5IaOcAIp2RlZmF1bHTAwMCYoXILBsDAkRnAwpyhaQEWGRyQwMIIwsDAl6FvAQAdH5DAmaFkAMyMHsCRHsDCmaFsr2l0ZXJhdG9yVG9BcnJheZIeMsDAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2l0ZXJhdG9yVG9BcnJheS5qc5ihcgkPwMCRHcDCl6FvAQAgOpDAmKFnAAEhJZDAwpmhZAQRIiOSIiDAwpmhbKZtYXBUYWeSIjXAwMAgkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvQXJyYXkuanOYoXIABsDAkSHAwpmhZAYRJMCSJCDAwpmhbKZzZXRUYWeSJDfAwMAgkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvQXJyYXkuanOYoXIABsDAkSPAwpihZwEBJiqQwMKZoWQEFSfAlCgpJyXAwpmhbKtzeW1JdGVyYXRvcpQnMDEzwMDAJZDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0FycmF5LmpzmKFyAAvAKJEmwMKYoXIDB8ApkQHAwpihcgMHwMCRAcDCmaFkARkrwNwAEiwtLi8wMTIzNDU2Nzg5KyYhI8DCmaFsp3RvQXJyYXmSKzzAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvQXJyYXkuanOYoXIJB8AskSrAwpihcjQLwC2RCsDCmKFyFgjALpENwMKYoXIKDcAvkRbAwpihcgoJwDCRBMDCmKFyFAvAMZEmwMKYoXIKC8AykSbAwpihchAPwDORHcDCmKFyBwvANJEmwMKYoXIXBsA1kQfAwpihch0GwDaRIcDCmKFyAwrAN5EQwMKYoXIKBsA4kSPAwpihcgMKwDmRE8DCmKFyAwbAwJEZwMKYoWcBAzvAkMDCmKFnCQs8wJE8wMKYoXIAB8DAkSrAwg==
====catalogjs annotation end====*/