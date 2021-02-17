import { default as constant } from "./constant.js";
import { default as createInverter } from "./dist/76.js";
import { default as identity } from "./identity.js";
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
var invert = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  result[value] = key;
}, constant(identity));
export { invert as default };
/*====catalogjs annotation start====
k5OVwq0uL2NvbnN0YW50LmpzA8LAlcKsLi9kaXN0Lzc2LmpzB8LAlcKtLi9pZGVudGl0eS5qcwvCwIGnZGVmYXVsdJWhbKZpbnZlcnQewMDcACCXoW8AAAPAkRbAmaFkCQACBJECwMKZoWmoY29uc3RhbnSSAhvAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmuY3JlYXRlSW52ZXJ0ZXKSBhnAAadkZWZhdWx0wMDAmKFyCw7AwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDsDAkMDCmaFkCQAKDJEKwMKZoWmoaWRlbnRpdHmSChzAAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcID8DAkMDCl6FvAQAOHZDAmKFnAAEPEZDAwpmhZAQTEMCSEA7AwpmhbKtvYmplY3RQcm90b5IQFMDAwA6Q2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW52ZXJ0LmpzmKFyAAvAwJEPwMKYoWcBARIVkMDCmaFkBAkTwJQUExEPwMKZoWy0bmF0aXZlT2JqZWN0VG9TdHJpbmeSExrAwMARkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydC5qc5ihcgAUwBSREsDCmKFyAwvAwJEPwMKYoWcBARbAkMDCmaFkBAAXwJQXFRgSwMKZoWymaW52ZXJ0khcfwMDAFZDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnZlcnQuanOYoXIABsAYkRbAwpihZwMCGcCUGRobHMDCmKFyAA7AGpEFwMKYoXJrFMAbkRLAwpihci0IwByRAcDCmKFyAQjAwJEJwMKYoWcBAx7AkMDCmKFnCQsfwJEfwMKYoXIABsDAkRbAwg==
====catalogjs annotation end====*/