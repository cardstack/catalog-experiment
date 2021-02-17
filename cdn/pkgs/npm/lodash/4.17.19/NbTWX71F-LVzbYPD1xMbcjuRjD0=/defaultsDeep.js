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
k5WVwqwuL2Rpc3QvNTMuanMDwsCVwq0uL2lzT2JqZWN0LmpzB8LAlcKtLi9kaXN0LzExMS5qcwvCwJXCrC4vZGlzdC80OS5qcw/CwJXCri4vbWVyZ2VXaXRoLmpzE8LAgadkZWZhdWx0laFsrGRlZmF1bHRzRGVlcCbAwNwAKJehbwAAA8CRHsCZoWQJAAIEkQLAwpmhaaliYXNlTWVyZ2WSAhrAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmoaXNPYmplY3STBhgZwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFppWFwcGx5kgojwAKnZGVmYXVsdMDAwJihcgsFwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpqGJhc2VSZXN0kg4hwAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA7AwJDAwpmhZAkAEhSREsDCmaFpqW1lcmdlV2l0aJISJMAEp2RlZmF1bHTAwMCYoXILCcDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgQwMCQwMKXoW8BABYckMCZoWQAQhfAlRgZGhcbwMKZoWyzY3VzdG9tRGVmYXVsdHNNZXJnZZMXGyLAwMDAkNlUV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jdXN0b21EZWZhdWx0c01lcmdlLmpzmKFyCRPAGJEWwMKYoXI5CMAZkQXAwpihcg4IwBqRBcDCmKFyNQnAG5EBwMKYoXIgE8DAkRbAwpehbwEAHSWQwJihZwABHsCQwMKZoWQEAB/Akx8dIMDCmaFsrGRlZmF1bHRzRGVlcJIfJ8DAwB2Q2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGVmYXVsdHNEZWVwLmpzmKFyAAzAIJEewMKYoWcDFiHAlCEiIyTAwpihcgAIwCKRDcDCmKFyKhPAI5EWwMKYoXIMBcAkkQnAwpihcgEJwMCREcDCmKFnAQMmwJDAwpihZwkLJ8CRJ8DCmKFyAAzAwJEewMI=
====catalogjs annotation end====*/