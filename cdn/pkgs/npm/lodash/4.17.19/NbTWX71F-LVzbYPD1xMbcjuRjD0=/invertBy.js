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
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC83Ni5qcwbCwIGnZGVmYXVsdJWhbKhpbnZlcnRCeRzAwNwAHpehbwAAA8CRFMCZoWQJAALAkQLAwpmhaaxiYXNlSXRlcmF0ZWWSAhrAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmaFprmNyZWF0ZUludmVydGVykgUXwAGnZGVmYXVsdMDAwJihcgsOwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgbkMCYoWcAAQkLkMDCmaFkBBMKwJIKCMDCmaFsq29iamVjdFByb3RvkwoOEsDAwAiQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW52ZXJ0QnkuanOYoXIAC8DAkQnAwpihZwEBDA+QwMKZoWQEDw3AlA4NCwnAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSDRnAwMALkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ludmVydEJ5LmpzmKFyAA/ADpEMwMKYoXIDC8DAkQnAwpihZwEBEBOQwMKZoWQECRHAlBIRDwnAwpmhbLRuYXRpdmVPYmplY3RUb1N0cmluZ5IRGMDAwA+Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW52ZXJ0QnkuanOYoXIAFMASkRDAwpihcgMLwMCRCcDCmKFnAQEUwJDAwpmhZAQAFcCVFRMWEAzAwpmhbKhpbnZlcnRCeZIVHcDAwBOQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW52ZXJ0QnkuanOYoXIACMAWkRTAwpihZwMBF8CUFxgZGsDCmKFyAA7AGJEEwMKYoXJrFMAZkRDAwpihchkPwBqRDMDCmKFyYgzAwJEBwMKYoWcBAxzAkMDCmKFnCQsdwJEdwMKYoXIACMDAkRTAwg==
====catalogjs annotation end====*/