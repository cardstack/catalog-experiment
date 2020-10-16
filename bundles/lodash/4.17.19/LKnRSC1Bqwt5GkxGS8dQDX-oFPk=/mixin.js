import { default as arrayEach } from "./dist/119.js";
import { default as arrayPush } from "./dist/139.js";
import { default as baseFunctions } from "./dist/83.js";
import { default as copyArray } from "./dist/117.js";
import { default as isFunction } from "./isFunction.js";
import { default as isObject } from "./isObject.js";
import { default as keys } from "./keys.js";








/**
 * Adds all own enumerable string keyed function properties of a source
 * object to the destination object. If `object` is a function, then methods
 * are added to its prototype as well.
 *
 * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
 * avoid conflicts caused by modifying the original.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {Function|Object} [object=lodash] The destination object.
 * @param {Object} source The object of functions to add.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
 * @returns {Function|Object} Returns `object`.
 * @example
 *
 * function vowels(string) {
 *   return _.filter(string, function(v) {
 *     return /[aeiou]/i.test(v);
 *   });
 * }
 *
 * _.mixin({ 'vowels': vowels });
 * _.vowels('fred');
 * // => ['e']
 *
 * _('fred').vowels().value();
 * // => ['e']
 *
 * _.mixin({ 'vowels': vowels }, { 'chain': false });
 * _('fred').vowels();
 * // => ['e']
 */

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
lZeVwq0uL2Rpc3QvMTE5LmpzAcLAlcKtLi9kaXN0LzEzOS5qcwXCwJXCrC4vZGlzdC84My5qcwnCwJXCrS4vZGlzdC8xMTcuanMNwsCVwq8uL2lzRnVuY3Rpb24uanMRwsCVwq0uL2lzT2JqZWN0LmpzFcLAlcKpLi9rZXlzLmpzGcLAgadkZWZhdWx0lKFspW1peGluIMCRkyDAwIipYXJyYXlFYWNom6FpkMICwJIDBMAAwKdkZWZhdWx0kKlhcnJheVB1c2iboWmQwgbAkgcIwAHAp2RlZmF1bHSQrWJhc2VGdW5jdGlvbnOboWmQwgrAkgsMwALAp2RlZmF1bHSQqWNvcHlBcnJheZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCqaXNGdW5jdGlvbpuhaZDCEsCSExTABMCnZGVmYXVsdJCoaXNPYmplY3SboWmQwhbAkhcYwAXAp2RlZmF1bHSQpGtleXOboWmQwhrAkhscwAbAp2RlZmF1bHSQpW1peGlum6Fsl6RrZXlzrWJhc2VGdW5jdGlvbnOoaXNPYmplY3SqaXNGdW5jdGlvbqlhcnJheUVhY2ipY29weUFycmF5qWFycmF5UHVzaMIdwJIeH8DAwMCQ3AAhlgAAAcDCw5YAGAIFwsKWCQADwMLClgsJwMDCwpYMCcAQwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWzP8JwMDCwpYBFwoNwsKWCQALwMLClgsNwMDCwpYeDcAYwsKWARgOEcLClgkAD8DCwpYLCcDAwsKWzQFVCcAIwsKWARoSFcLClgkAE8DCwpYLCsDAwsKWRArABMLClgEYFhnCwpYJABfAwsKWCwjAwMLCliEIwBTCwpYBFBodwsKWCQAbwMLClgsEwMDCwpYqBMAMwsKWzQQiRR4gwsKWCQXAHMLClgkFwMDCwpYDDh/AwsI=
====catalogjs annotation end====*/