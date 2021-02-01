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
k5WVwqwuL2Rpc3QvNTMuanMDwsCVwq0uL2lzT2JqZWN0LmpzBsLAlcKtLi9kaXN0LzExMS5qcwnCwJXCrC4vZGlzdC80OS5qcwzCwJXCri4vbWVyZ2VXaXRoLmpzD8LAgadkZWZhdWx0lKFsrGRlZmF1bHRzRGVlcCHA3AAjl6FvAAADwJEZwJmhZAkAAsCRAsDCmKFpqWJhc2VNZXJnZZICFcAAp2RlZmF1bHTAwJihcgsJwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaahpc09iamVjdJMFExTAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmlYXBwbHmSCB7AAqdkZWZhdWx0wMCYoXILBcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKYoWmoYmFzZVJlc3SSCxzAA6dkZWZhdWx0wMCYoXILCMDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKYoWmpbWVyZ2VXaXRokg4fwASnZGVmYXVsdMDAmKFyCwnAwJENwMKcoWkBGQ0QkMDCBMLAwJehbwEAEReQwJmhZABCEsCVExQVEhbAwpihbLNjdXN0b21EZWZhdWx0c01lcmdlkxIWHcDAwMDZVFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY3VzdG9tRGVmYXVsdHNNZXJnZS5qc5ihcgkTwBOREcDCmKFyOQjAFJEEwMKYoXIOCMAVkQTAwpihcjUJwBaRAcDCmKFyIBPAwJERwMKXoW8BABggkMCYoWcAARnAkMDCmaFkBAAawJMaGBvAwpihbKxkZWZhdWx0c0RlZXCSGiLAwMAY2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGVmYXVsdHNEZWVwLmpzmKFyAAzAG5EZwMKYoWcDFhzAlBwdHh/AwpihcgAIwB2RCsDCmKFyKhPAHpERwMKYoXIMBcAfkQfAwpihcgEJwMCRDcDCmKFnAQMhwJDAwpihZwkLIsCRIsDCmKFyAAzAwJEZwMI=
====catalogjs annotation end====*/