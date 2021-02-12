import { default as baseMerge } from "./dist/53.js";
import { default as isObject } from "./isObject.js";
import { default as apply } from "./dist/111.js";
import { default as baseRest } from "./dist/49.js";
import { default as mergeWith } from "./mergeWith.js";
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }

  return objValue;
}
var defaultsDeep = baseRest(function (args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});
export { defaultsDeep as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvNTMuanMDwsCVwq0uL2lzT2JqZWN0LmpzBsLAlcKtLi9kaXN0LzExMS5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCri4vbWVyZ2VXaXRoLmpzD8LAgadkZWZhdWx0laFsrGRlZmF1bHRzRGVlcCHAwNwAI5ehbwAAA8CRGcCZoWQJAALAkQLAwpmhaaliYXNlTWVyZ2WSAhXAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqGlzT2JqZWN0kwUTFMABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmlYXBwbHmSCB7AAqdkZWZhdWx0wMDAmKFyCwXAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGJhc2VSZXN0kgscwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7AwpmhaaltZXJnZVdpdGiSDh/ABKdkZWZhdWx0wMDAmKFyCwnAwJENwMKcoWkBGQ0QkMDCBMLAwJehbwEAEReQwJmhZABCEsCVExQVEhbAwpmhbLNjdXN0b21EZWZhdWx0c01lcmdlkxIWHcDAwMCQ2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2N1c3RvbURlZmF1bHRzTWVyZ2UuanOYoXIJE8ATkRHAwpihcjkIwBSRBMDCmKFyDgjAFZEEwMKYoXI1CcAWkQHAwpihciATwMCREcDCl6FvAQAYIJDAmKFnAAEZwJDAwpmhZAQAGsCTGhgbwMKZoWysZGVmYXVsdHNEZWVwkhoiwMDAGJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWZhdWx0c0RlZXAuanOYoXIADMAbkRnAwpihZwMWHMCUHB0eH8DCmKFyAAjAHZEKwMKYoXIqE8AekRHAwpihcgwFwB+RB8DCmKFyAQnAwJENwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIADMDAkRnAwg==
====catalogjs annotation end====*/