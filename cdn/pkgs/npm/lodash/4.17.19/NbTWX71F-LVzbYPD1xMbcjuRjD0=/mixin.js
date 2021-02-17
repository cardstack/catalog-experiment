import { default as arrayEach } from "./dist/119.js";
import { default as arrayPush } from "./dist/139.js";
import { default as baseFunctions } from "./dist/83.js";
import { default as copyArray } from "./dist/117.js";
import { default as isFunction } from "./isFunction.js";
import { default as isObject } from "./isObject.js";
import { default as keys } from "./keys.js";
function mixin(object, source, options) {
  var props = keys(source),
      methodNames = baseFunctions(source, props);
  var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
      isFunc = isFunction(object);
  arrayEach(methodNames, function (methodName) {
    var func = source[methodName];
    object[methodName] = func;

    if (isFunc) {
      object.prototype[methodName] = function () {
        var chainAll = this.__chain__;

        if (chain || chainAll) {
          var result = object(this.__wrapped__),
              actions = result.__actions__ = copyArray(this.__actions__);
          actions.push({
            'func': func,
            'args': arguments,
            'thisArg': object
          });
          result.__chain__ = chainAll;
          return result;
        }

        return func.apply(object, arrayPush([this.value()], arguments));
      };
    }
  });
  return object;
}
export { mixin as default };
/*====catalogjs annotation start====
k5eVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEzOS5qcwfCwJXCrC4vZGlzdC84My5qcwvCwJXCrS4vZGlzdC8xMTcuanMPwsCVwq8uL2lzRnVuY3Rpb24uanMTwsCVwq0uL2lzT2JqZWN0LmpzF8LAlcKpLi9rZXlzLmpzG8LAgadkZWZhdWx0laFspW1peGluKMDA3AAql6FvAAADwJDAmaFkCQACBJECwMKZoWmpYXJyYXlFYWNokgIkwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqWFycmF5UHVzaJIGJsABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaa1iYXNlRnVuY3Rpb25zkgohwAKnZGVmYXVsdMDAwJihcgsNwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA7AwJDAwpmhZAkADhCRDsDCmaFpqWNvcHlBcnJheZIOJcADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgPwMCQwMKZoWQJABIUkRLAwpmhaappc0Z1bmN0aW9ukhIjwASnZGVmYXVsdMDAwJihcgsKwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCBHAwJDAwpmhZAkAFhiRFsDCmaFpqGlzT2JqZWN0khYiwAWnZGVmYXVsdMDAwJihcgsIwMCRFcDCnKFpAQEVG5EYwMIFwsDAmKFnCA/AwJDAwpmhZAkAGhyRGsDCmaFppGtleXOSGiDABqdkZWZhdWx0wMDAmKFyCwTAwJEZwMKcoWkBARkdkRzAwgbCwMCYoWcIC8DAkMDCl6FvAQAeJ5DAmaFkAEUfwJggISIjJCUmH8DCmaFspW1peGlukh8pwMDAwJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9taXhpbi5qc5ihcgkFwCCRHsDCmKFyKgTAIZEZwMKYoXIeDcAikQnAwpihciEIwCORFcDCmKFyRArAJJERwMKYoXIMCcAlkQHAwpihcs0BVQnAJpENwMKYoXLM/wnAwJEFwMKYoWcBAyjAkMDCmKFnCQspwJEpwMKYoXIABcDAkR7Awg==
====catalogjs annotation end====*/