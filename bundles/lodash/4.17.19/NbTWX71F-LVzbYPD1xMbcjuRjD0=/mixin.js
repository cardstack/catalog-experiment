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
k5eVwq0uL2Rpc3QvMTE5LmpzA8LAlcKtLi9kaXN0LzEzOS5qcwbCwJXCrC4vZGlzdC84My5qcwnCwJXCrS4vZGlzdC8xMTcuanMMwsCVwq8uL2lzRnVuY3Rpb24uanMPwsCVwq0uL2lzT2JqZWN0LmpzEsLAlcKpLi9rZXlzLmpzFcLAgadkZWZhdWx0lKFspW1peGluIcDcACOXoW8AAAPAkRfAmaFkCQACwJECwMKYoWmpYXJyYXlFYWNokgIdwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqWFycmF5UHVzaJIFH8ABp2RlZmF1bHTAwJihcgsJwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaa1iYXNlRnVuY3Rpb25zkggawAKnZGVmYXVsdMDAmKFyCw3AwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFpqWNvcHlBcnJheZILHsADp2RlZmF1bHTAwJihcgsJwMCRCsDCnKFpARgKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaappc0Z1bmN0aW9ukg4cwASnZGVmYXVsdMDAmKFyCwrAwJENwMKcoWkBGg0SkMDCBMLAwJmhZAkAEcCREcDCmKFpqGlzT2JqZWN0khEbwAWnZGVmYXVsdMDAmKFyCwjAwJEQwMKcoWkBGBAVkMDCBcLAwJmhZAkAFMCRFMDCmKFppGtleXOSFBnABqdkZWZhdWx0wMCYoXILBMDAkRPAwpyhaQEUExaQwMIGwsDAl6FvAQAXIJDAmaFkAEUYwJgZGhscHR4fGMDCmKFspW1peGlukhgiwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21peGluLmpzmKFyCQXAGZEXwMKYoXIqBMAakRPAwpihch4NwBuRB8DCmKFyIQjAHJEQwMKYoXJECsAdkQ3AwpihcgwJwB6RAcDCmKFyzQFVCcAfkQrAwpihcsz/CcDAkQTAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgAFwMCRF8DC
====catalogjs annotation end====*/