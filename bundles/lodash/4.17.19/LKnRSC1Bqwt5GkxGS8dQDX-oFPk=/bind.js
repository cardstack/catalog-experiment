import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";





/** Used to compose bitmasks for function metadata. */

var WRAP_BIND_FLAG = 1,
    WRAP_PARTIAL_FLAG = 32;
/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and `partials` prepended to the arguments it receives.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * function greet(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * }
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */

var bind = baseRest(function (func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(func, bitmask, thisArg, partials, holders);
}); // Assign default placeholders.

bind.placeholder = {};

export { bind as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDkuanMBwsCVwqwuL2Rpc3QvMjMuanMFwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcw3CwIGnZGVmYXVsdJShbKRiaW5kH8CRkx/AwIeoYmFzZVJlc3SboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNyZWF0ZVdyYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWdldEhvbGRlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCucmVwbGFjZUhvbGRlcnOboWmQwg7Akg8QwAPAp2RlZmF1bHSQrldSQVBfQklORF9GTEFHm6FskMISwJITFMDAwMCQsVdSQVBfUEFSVElBTF9GTEFHm6FskMIVwJIWF8DAwMCQpGJpbmSboWyXqGJhc2VSZXN0rldSQVBfQklORF9GTEFHrnJlcGxhY2VIb2xkZXJzqWdldEhvbGRlcqRiaW5ksVdSQVBfUEFSVElBTF9GTEFHqmNyZWF0ZVdyYXDDGR6UGhscHcDAwMCXqGJhc2VSZXN0qmNyZWF0ZVdyYXCpZ2V0SG9sZGVyrnJlcGxhY2VIb2xkZXJzrldSQVBfQklORF9GTEFHsVdSQVBfUEFSVElBTF9GTEFHpGJpbmTcACCWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgAIwBTCwpYBFwYJwsKWCQAHwMLClgsKwMDCwpYQCsDAwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWCwnAG8LClgEYDhHCwpYJAA/AwsKWCw7AwMLCli4OwAzCwpY+ARIYwsKWBAQTFcLClgAOwMDCwpY2DsAQwsKWBgUWwMLClgARwMDCwpYTEcAIwsKWzQQdARkcwsKWBAAawMLClgAEwB7CwpYBBMAXwsKWIgTAH8LClgkEwMDCwpYDLwTAwsKWFA4dwMLC
====catalogjs annotation end====*/