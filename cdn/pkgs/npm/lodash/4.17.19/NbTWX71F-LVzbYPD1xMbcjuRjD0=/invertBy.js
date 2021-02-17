import { default as baseIteratee } from "./dist/6.js";
import { default as createInverter } from "./dist/76.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var invertBy = createInverter(function (result, value, key) {
  if (value != null && typeof value.toString != 'function') {
    value = nativeObjectToString.call(value);
  }

  if (hasOwnProperty0.call(result, value)) {
    result[value].push(key);
  } else {
    result[value] = [key];
  }
}, baseIteratee);
export { invertBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC83Ni5qcwfCwIGnZGVmYXVsdJWhbKhpbnZlcnRCeR7AwNwAIJehbwAAA8CRFsCZoWQJAAIEkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAhzAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmuY3JlYXRlSW52ZXJ0ZXKSBhnAAadkZWZhdWx0wMDAmKFyCw7AwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDsDAkMDCl6FvAQAKHZDAmKFnAAELDZDAwpmhZAQTDMCSDArAwpmhbKtvYmplY3RQcm90b5MMEBTAwMAKkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydEJ5LmpzmKFyAAvAwJELwMKYoWcBAQ4RkMDCmaFkBA8PwJQQDw0LwMKZoWyvaGFzT3duUHJvcGVydHkwkg8bwMDADZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pbnZlcnRCeS5qc5ihcgAPwBCRDsDCmKFyAwvAwJELwMKYoWcBARIVkMDCmaFkBAkTwJQUExELwMKZoWy0bmF0aXZlT2JqZWN0VG9TdHJpbmeSExrAwMARkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydEJ5LmpzmKFyABTAFJESwMKYoXIDC8DAkQvAwpihZwEBFsCQwMKZoWQEABfAlRcVGBIOwMKZoWyoaW52ZXJ0QnmSFx/AwMAVkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydEJ5LmpzmKFyAAjAGJEWwMKYoWcDARnAlBkaGxzAwpihcgAOwBqRBcDCmKFyaxTAG5ESwMKYoXIZD8AckQ7AwpihcmIMwMCRAcDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAAjAwJEWwMI=
====catalogjs annotation end====*/