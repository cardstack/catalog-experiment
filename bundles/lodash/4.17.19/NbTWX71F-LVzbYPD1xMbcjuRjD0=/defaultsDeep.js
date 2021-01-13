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
k5WVwqwuL2Rpc3QvNTMuanMDwsCVwq0uL2lzT2JqZWN0LmpzBsLAlcKtLi9kaXN0LzExMS5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCri4vbWVyZ2VXaXRoLmpzD8LAgadkZWZhdWx0lKFsrGRlZmF1bHRzRGVlcCHA3AAjl6FvAAADwJIRGcCZoWQJAALAkQLAwpihaaliYXNlTWVyZ2WSAhXAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoaXNPYmplY3STBRMUwAGnZGVmYXVsdMDAmKFyCwjAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFppWFwcGx5kggewAKnZGVmYXVsdMDAmKFyCwXAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqGJhc2VSZXN0kgscwAOnZGVmYXVsdMDAmKFyCwjAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFpqW1lcmdlV2l0aJIOH8AEp2RlZmF1bHTAwJihcgsJwMCRDcDCnKFpARkNEJDAwgTCwMCXoW8BABEXkMCZoWQAQhLAlRMUFRIWwMKYoWyzY3VzdG9tRGVmYXVsdHNNZXJnZZMSFh3AwMDA2VRXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2N1c3RvbURlZmF1bHRzTWVyZ2UuanOYoXIJE8ATkRHAwpihcjkIwBSRBMDCmKFyDgjAFZEEwMKYoXI1CcAWkQHAwpihciATwMCREcDCl6FvAQAYIJDAmKFnAAEZwJDAwpmhZAQAGsCTGhgbwMKYoWysZGVmYXVsdHNEZWVwkhoiwMDAGNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2RlZmF1bHRzRGVlcC5qc5ihcgAMwBuRGcDCmKFnAxYcwJUcHR4fGcDCmKFyAAjAHZEKwMKYoXIqE8AekRHAwpihcgwFwB+RB8DCmKFyAQnAwJENwMKYoWcBAyHAkMDCmKFnCQsiwJEiwMKYoXIADMDAkRnAwg==
====catalogjs annotation end====*/