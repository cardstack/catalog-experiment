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
k5eVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEzOS5qcwbCwJXCrC4vZGlzdC84My5qcwnCwJXCrS4vZGlzdC8xMTcuanMMwsCVwq8uL2lzRnVuY3Rpb24uanMPwsCVwq0uL2lzT2JqZWN0LmpzEsLAlcKpLi9rZXlzLmpzFcLAgadkZWZhdWx0lKFspW1peGluIcDcACOXoW8AAAPAkMCZoWQJAALAkQLAwpihaalhcnJheUVhY2iSAh3AAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmpYXJyYXlQdXNokgUfwAGnZGVmYXVsdMDAmKFyCwnAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprWJhc2VGdW5jdGlvbnOSCBrAAqdkZWZhdWx0wMCYoXILDcDAkQfAwpyhaQEXBwyQwMICwsDAmaFkCQALwJELwMKYoWmpY29weUFycmF5kgsewAOnZGVmYXVsdMDAmKFyCwnAwJEKwMKcoWkBGAoPkMDCA8LAwJmhZAkADsCRDsDCmKFpqmlzRnVuY3Rpb26SDhzABKdkZWZhdWx0wMCYoXILCsDAkQ3AwpyhaQEaDRKQwMIEwsDAmaFkCQARwJERwMKYoWmoaXNPYmplY3SSERvABadkZWZhdWx0wMCYoXILCMDAkRDAwpyhaQEYEBWQwMIFwsDAmaFkCQAUwJEUwMKYoWmka2V5c5IUGcAGp2RlZmF1bHTAwJihcgsEwMCRE8DCnKFpARQTFpDAwgbCwMCXoW8BABcgkMCZoWQARRjAmBkaGxwdHh8YwMKYoWylbWl4aW6SGCLAwMDA2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWl4aW4uanOYoXIJBcAZkRfAwpihcioEwBqRE8DCmKFyHg3AG5EHwMKYoXIhCMAckRDAwpihckQKwB2RDcDCmKFyDAnAHpEBwMKYoXLNAVUJwB+RCsDCmKFyzP8JwMCRBMDCmKFnAQMhwJDAwpihZwkLIsCRIsDCmKFyAAXAwJEXwMI=
====catalogjs annotation end====*/