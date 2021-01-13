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
k5aVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwbCwJXCrS4vZGlzdC8xMTQuanMJwsCVwqwuL2lzQXJyYXkuanMMwsCVwrEuL2lzT2JqZWN0TGlrZS5qcw/CwJXCrS4vZGlzdC8xMDEuanMSwsCBp2RlZmF1bHSUoWymbG9kYXNoKsDcACyXoW8AAAPAkhskwJmhZAkAAsCRAsDCmKFpq0xhenlXcmFwcGVykgIfwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFprUxvZGFzaFdyYXBwZXKTBSAjwAGnZGVmYXVsdMDAmKFyCw3AwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpqmJhc2VMb2Rhc2iSCCbAAqdkZWZhdWx0wMCYoXILCsDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmnaXNBcnJheZILHsADp2RlZmF1bHTAwJihcgsHwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaaxpc09iamVjdExpa2WSDh3ABKdkZWZhdWx0wMCYoXILDMDAkQ3AwpyhaQEcDRKQwMIEwsDAmaFkCQARwJERwMKYoWmsd3JhcHBlckNsb25lkhEiwAWnZGVmYXVsdMDAmKFyCwzAwJEQwMKcoWkBGBATkMDCBcLAwJehbwEAFCmQwJihZwABFReQwMKZoWQEExbAkxYUJMDCmKFsq29iamVjdFByb3RvkhYawMDAFNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJMb2Rhc2guanOYoXIAC8DAkRXAwpihZwEBGBuQwMKZoWQEDxnAlRoZFxUkwMKYoWyuaGFzT3duUHJvcGVydHmSGSHAwMAX2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd3JhcHBlckxvZGFzaC5qc5ihcgAOwBqRGMDCmKFyAwvAwJEVwMKZoWQBChwkmh0eHyAhIiMcGCTAwpihbKZsb2Rhc2iVHCUnKCvAwMDA2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd3JhcHBlckxvZGFzaC5qc5ihcgkGwB2RG8DCmKFyEAzAHpENwMKYoXIMB8AfkQrAwpihch4LwCCRAcDCmKFyHg3AIZEEwMKYoXInDsAikRjAwpihciwMwCOREMDCmKFyIQ3AwJEEwMKYoWcBASXAlCUmJyjAw5ihcgAGwCaRG8DCmKFyDQrAJ5EHwMKYoXIMBsAokRvAwpihchkGwMCRG8DCmKFnAQMqwJDAwpihZwkLK8CRK8DCmKFyAAbAwJEbwMI=
====catalogjs annotation end====*/