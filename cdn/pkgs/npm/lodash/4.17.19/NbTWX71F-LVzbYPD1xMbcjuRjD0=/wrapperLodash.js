import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as baseLodash } from "./dist/114.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as wrapperClone } from "./dist/101.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }

    if (hasOwnProperty0.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }

  return new LodashWrapper(value);
}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
export { lodash as default };
/*====catalogjs annotation start====
k5aVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwbCwJXCrS4vZGlzdC8xMTQuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwrEuL2lzT2JqZWN0TGlrZS5qcw/CwJXCrS4vZGlzdC8xMDEuanMSwsCBp2RlZmF1bHSVoWymbG9kYXNoKsDA3AAsl6FvAAADwJEkwJmhZAkAAsCRAsDCmaFpq0xhenlXcmFwcGVykgIfwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa1Mb2Rhc2hXcmFwcGVykwUgI8ABp2RlZmF1bHTAwMCYoXILDcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmqYmFzZUxvZGFzaJIIJsACp2RlZmF1bHTAwMCYoXILCsDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKZoWmnaXNBcnJheZILHsADp2RlZmF1bHTAwMCYoXILB8DAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmsaXNPYmplY3RMaWtlkg4dwASnZGVmYXVsdMDAwJihcgsMwMCRDcDCnKFpARwNEpDAwgTCwMCZoWQJABHAkRHAwpmhaax3cmFwcGVyQ2xvbmWSESLABadkZWZhdWx0wMDAmKFyCwzAwJEQwMKcoWkBGBATkMDCBcLAwJehbwEAFCmQwJihZwABFReQwMKZoWQEExbAkhYUwMKZoWyrb2JqZWN0UHJvdG+SFhrAwMAUkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJMb2Rhc2guanOYoXIAC8DAkRXAwpihZwEBGBuQwMKZoWQEDxnAlBoZFxXAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSGSHAwMAXkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJMb2Rhc2guanOYoXIAD8AakRjAwpihcgMLwMCRFcDCmaFkAQocJJkdHh8gISIjHBjAwpmhbKZsb2Rhc2iVHCUnKCvAwMDAkSTZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy93cmFwcGVyTG9kYXNoLmpzmKFyCQbAHZEbwMKYoXIQDMAekQ3AwpihcgwHwB+RCsDCmKFyHgvAIJEBwMKYoXIeDcAhkQTAwpihcicPwCKRGMDCmKFyLAzAI5EQwMKYoXIhDcDAkQTAwpihZwEBJcCUJSYnKMDDmKFyAAbAJpEbwMKYoXINCsAnkQfAwpihcgwGwCiRG8DCmKFyGQbAwJEbwMKYoWcBAyrAkMDCmKFnCQsrwJErwMKYoXIABsDAkRvAwg==
====catalogjs annotation end====*/