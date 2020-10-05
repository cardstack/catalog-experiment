import { default as baseKeys } from "./dist/132.js";
import { default as getTag } from "./dist/45.js";
import { default as isArguments } from "./isArguments.js";
import { default as isArray } from "./isArray.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isBuffer } from "./isBuffer.js";
import { default as isPrototype } from "./dist/133.js";
import { default as isTypedArray } from "./isTypedArray.js";









/** `Object#toString` result references. */

var mapTag = '[object Map]',
    setTag = '[object Set]';
/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */

function isEmpty(value) {
  if (value == null) {
    return true;
  }

  if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }

  var tag = getTag(value);

  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }

  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }

  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
}

const _default = (isEmpty);
export { _default as default };
/*====catalogjs annotation start====
lZiTwq0uL2Rpc3QvMTMyLmpzAZPCrC4vZGlzdC80NS5qcwWTwrAuL2lzQXJndW1lbnRzLmpzCZPCrC4vaXNBcnJheS5qcw2TwrAuL2lzQXJyYXlMaWtlLmpzEZPCrS4vaXNCdWZmZXIuanMVk8KtLi9kaXN0LzEzMy5qcxmTwrEuL2lzVHlwZWRBcnJheS5qcx2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQ5wJGTOcDCjqhiYXNlS2V5c5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCmZ2V0VGFnm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtpc0FyZ3VtZW50c5uhaZDCCsCSCwzAAsCnZGVmYXVsdJCnaXNBcnJheZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCraXNBcnJheUxpa2WboWmQwhLAkhMUwATAp2RlZmF1bHSQqGlzQnVmZmVym6FpkMIWwJIXGMAFwKdkZWZhdWx0kKtpc1Byb3RvdHlwZZuhaZDCGsCSGxzABsCnZGVmYXVsdJCsaXNUeXBlZEFycmF5m6FpkMIewJIfIMAHwKdkZWZhdWx0kKZtYXBUYWeboWyQwiLAkiMkwMDAwJCmc2V0VGFnm6FskMIlwJImJ8DAwMCQq29iamVjdFByb3Rvm6FskaZPYmplY3TCKSySKivAwMDAkK5oYXNPd25Qcm9wZXJ0eZuhbJGrb2JqZWN0UHJvdG/CLjGSLzDAwMDAkatvYmplY3RQcm90b6dpc0VtcHR5m6Fsm6tpc0FycmF5TGlrZadpc0FycmF5qGlzQnVmZmVyrGlzVHlwZWRBcnJheatpc0FyZ3VtZW50c6ZnZXRUYWembWFwVGFnpnNldFRhZ6tpc1Byb3RvdHlwZahiYXNlS2V5c65oYXNPd25Qcm9wZXJ0ecIywJIzNMDAwMCQqF9kZWZhdWx0m6Fskadpc0VtcHR5wjbAkjc4wMDAwJDcADqWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClhcIwDDCwpYBFwYJwsKWCQAHwMLClgsGwMDCwpY3BsAkwsKWARsKDcLClgkAC8DCwpYLC8DAwsKWCwvACMLClgEXDhHCwpYJAA/AwsKWCwfAwMLClgwHwBjCwpYBGxIVwsKWCQATwMLClgsLwMDCwpY9C8AQwsKWARgWGcLClgkAF8DCwpYLCMDAwsKWTAjAIMLClgEYGh3CwpYJABvAwsKWCwvAwMLClicLwATCwpYBHB4hwsKWCQAfwMLClgsMwMDCwpYLDMAMwsKWNwEiKMLClgQRIyXCwpYABsDAwsKWFwbAJ8LClgYRJsDCwpYABsDAwsKWCwbAHMLCli4BKS3CwpYEACrAwsKWAAvALMLClgALwMDCwpYDEMDAwsKWMwEuMsLClgQAL8DCwpYADsAxwsKWOA7AwMLClgMPK8DCwpbNAxlEMzXCwpYJB8AUwsKWBAfAwMLClgIBNjnCwpYGATfAwsKWAAjANMLClgkIwMDCwpYBDjjAwsI=
====catalogjs annotation end====*/