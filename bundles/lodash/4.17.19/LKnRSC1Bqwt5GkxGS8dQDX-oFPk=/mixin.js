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

const _default = (mixin);
export { _default as default };
/*====catalogjs annotation start====
lZeTwq0uL2Rpc3QvMTE5LmpzAZPCrS4vZGlzdC8xMzkuanMFk8KsLi9kaXN0LzgzLmpzCZPCrS4vZGlzdC8xMTcuanMNk8KvLi9pc0Z1bmN0aW9uLmpzEZPCrS4vaXNPYmplY3QuanMVk8KpLi9rZXlzLmpzGYGnZGVmYXVsdJShbKhfZGVmYXVsdCTAkZMkwMKJqWFycmF5RWFjaJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpYXJyYXlQdXNom6FpkMIGwJIHCMABwKdkZWZhdWx0kK1iYXNlRnVuY3Rpb25zm6FpkMIKwJILDMACwKdkZWZhdWx0kKljb3B5QXJyYXmboWmQwg7Akg8QwAPAp2RlZmF1bHSQqmlzRnVuY3Rpb26boWmQwhLAkhMUwATAp2RlZmF1bHSQqGlzT2JqZWN0m6FpkMIWwJIXGMAFwKdkZWZhdWx0kKRrZXlzm6FpkMIawJIbHMAGwKdkZWZhdWx0kKVtaXhpbpuhbJeka2V5c61iYXNlRnVuY3Rpb25zqGlzT2JqZWN0qmlzRnVuY3Rpb26pYXJyYXlFYWNoqWNvcHlBcnJhealhcnJheVB1c2jCHcCSHh/AwMDAkKhfZGVmYXVsdJuhbJGlbWl4aW7CIcCSIiPAwMDAkNwAJZYAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWDAnAEMLClgEYBgnCwpYJAAfAwsKWCwnAwMLClsz/CcDAwsKWARcKDcLClgkAC8DCwpYLDcDAwsKWHg3AGMLClgEYDhHCwpYJAA/AwsKWCwnAwMLCls0BVQnACMLClgEaEhXCwpYJABPAwsKWCwrAwMLClkQKwATCwpYBGBYZwsKWCQAXwMLClgsIwMDCwpYhCMAUwsKWARQaHcLClgkAG8DCwpYLBMDAwsKWKgTADMLCls0EIkUeIMLClgkFwBzCwpYEBcDAwsKWAgEhJMLClgYBIsDCwpYACMAfwsKWCQjAwMLClgEOI8DCwg==
====catalogjs annotation end====*/