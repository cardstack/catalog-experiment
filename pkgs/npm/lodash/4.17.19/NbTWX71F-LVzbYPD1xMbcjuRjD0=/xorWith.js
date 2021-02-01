import { default as arrayFilter } from "./dist/150.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseXor } from "./dist/60.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var xorWith = baseRest(function (arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
});
export { xorWith as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTUwLmpzA8LAlcKsLi9kaXN0LzQ5LmpzBsLAlcKsLi9kaXN0LzYwLmpzCcLAlcK2Li9pc0FycmF5TGlrZU9iamVjdC5qcwzCwJXCqS4vbGFzdC5qcw/CwIGnZGVmYXVsdJShbKd4b3JXaXRoG8DcAB2XoW8AAAPAkRLAmaFkCQACwJECwMKYoWmrYXJyYXlGaWx0ZXKSAhjAAKdkZWZhdWx0wMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoYmFzZVJlc3SSBRXAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmnYmFzZVhvcpIIF8ACp2RlZmF1bHTAwJihcgsHwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihabFpc0FycmF5TGlrZU9iamVjdJILGcADp2RlZmF1bHTAwJihcgsRwMCRCsDCnKFpASEKD5DAwgPCwMCZoWQJAA7AkQ7AwpihaaRsYXN0kg4WwASnZGVmYXVsdMDAmKFyCwTAwJENwMKcoWkBFA0QkMDCBMLAwJehbwEAERqQwJihZwABEsCQwMKZoWQEABPAkxMRFMDCmKFsp3hvcldpdGiSExzAwMAR2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMveG9yV2l0aC5qc5ihcgAHwBSREsDCmKFnAx0VwJUVFhcYGcDCmKFyAAjAFpEEwMKYoXIoBMAXkQ3AwpihclwHwBiRB8DCmKFyAQvAGZEBwMKYoXIJEcDAkQrAwpihZwEDG8CQwMKYoWcJCxzAkRzAwpihcgAHwMCREsDC
====catalogjs annotation end====*/