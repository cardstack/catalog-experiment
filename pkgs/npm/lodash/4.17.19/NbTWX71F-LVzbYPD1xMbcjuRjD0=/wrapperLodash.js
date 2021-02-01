import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as baseLodash } from "./dist/114.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as wrapperClone } from "./dist/101.js";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }

    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }

  return new LodashWrapper(value);
}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
export { lodash as default };
/*====catalogjs annotation start====
k5aVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwbCwJXCrS4vZGlzdC8xMTQuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwrEuL2lzT2JqZWN0TGlrZS5qcw/CwJXCrS4vZGlzdC8xMDEuanMSwsCBp2RlZmF1bHSUoWymbG9kYXNoKsDcACyXoW8AAAPAkSTAmaFkCQACwJECwMKYoWmrTGF6eVdyYXBwZXKSAh/AAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmtTG9kYXNoV3JhcHBlcpMFICPAAadkZWZhdWx0wMCYoXILDcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmqYmFzZUxvZGFzaJIIJsACp2RlZmF1bHTAwJihcgsKwMCRB8DCnKFpARgHDJDAwgLCwMCZoWQJAAvAkQvAwpihaadpc0FycmF5kgsewAOnZGVmYXVsdMDAmKFyCwfAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFprGlzT2JqZWN0TGlrZZIOHcAEp2RlZmF1bHTAwJihcgsMwMCRDcDCnKFpARwNEpDAwgTCwMCZoWQJABHAkRHAwpihaax3cmFwcGVyQ2xvbmWSESLABadkZWZhdWx0wMCYoXILDMDAkRDAwpyhaQEYEBOQwMIFwsDAl6FvAQAUKZDAmKFnAAEVF5DAwpmhZAQTFsCSFhTAwpihbKtvYmplY3RQcm90b5IWGsDAwBTZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy93cmFwcGVyTG9kYXNoLmpzmKFyAAvAwJEVwMKYoWcBARgbkMDCmaFkBA8ZwJQaGRcVwMKYoWyuaGFzT3duUHJvcGVydHmSGSHAwMAX2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd3JhcHBlckxvZGFzaC5qc5ihcgAOwBqRGMDCmKFyAwvAwJEVwMKZoWQBChwkmR0eHyAhIiMcGMDCmKFspmxvZGFzaJUcJScoK8DAwMDZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy93cmFwcGVyTG9kYXNoLmpzmKFyCQbAHZEbwMKYoXIQDMAekQ3AwpihcgwHwB+RCsDCmKFyHgvAIJEBwMKYoXIeDcAhkQTAwpihcicOwCKRGMDCmKFyLAzAI5EQwMKYoXIhDcDAkQTAwpihZwEBJcCUJSYnKMDDmKFyAAbAJpEbwMKYoXINCsAnkQfAwpihcgwGwCiRG8DCmKFyGQbAwJEbwMKYoWcBAyrAkMDCmKFnCQsrwJErwMKYoXIABsDAkRvAwg==
====catalogjs annotation end====*/