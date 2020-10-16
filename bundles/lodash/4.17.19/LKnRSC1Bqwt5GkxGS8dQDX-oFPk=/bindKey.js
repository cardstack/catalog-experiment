import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";





/** Used to compose bitmasks for function metadata. */

var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_PARTIAL_FLAG = 32;
/**
 * Creates a function that invokes the method at `object[key]` with `partials`
 * prepended to the arguments it receives.
 *
 * This method differs from `_.bind` by allowing bound functions to reference
 * methods that may be redefined or don't yet exist. See
 * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
 * for more details.
 *
 * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Function
 * @param {Object} object The object to invoke the method on.
 * @param {string} key The key of the method.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var object = {
 *   'user': 'fred',
 *   'greet': function(greeting, punctuation) {
 *     return greeting + ' ' + this.user + punctuation;
 *   }
 * };
 *
 * var bound = _.bindKey(object, 'greet', 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * object.greet = function(greeting, punctuation) {
 *   return greeting + 'ya ' + this.user + punctuation;
 * };
 *
 * bound('!');
 * // => 'hiya fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bindKey(object, 'greet', _, '!');
 * bound('hi');
 * // => 'hiya fred!'
 */

var bindKey = baseRest(function (object, key, partials) {
  var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bindKey));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(key, bitmask, object, partials, holders);
}); // Assign default placeholders.

bindKey.placeholder = {};

export { bindKey as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDkuanMBwsCVwqwuL2Rpc3QvMjMuanMFwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcw3CwIGnZGVmYXVsdJShbKdiaW5kS2V5IsCRkyLAwIioYmFzZVJlc3SboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNyZWF0ZVdyYXCboWmQwgbAkgcIwAHAp2RlZmF1bHSQqWdldEhvbGRlcpuhaZDCCsCSCwzAAsCnZGVmYXVsdJCucmVwbGFjZUhvbGRlcnOboWmQwg7Akg8QwAPAp2RlZmF1bHSQrldSQVBfQklORF9GTEFHm6FskMISwJITFMDAwMCQsldSQVBfQklORF9LRVlfRkxBR5uhbJDCFcCSFhfAwMDAkLFXUkFQX1BBUlRJQUxfRkxBR5uhbJDCGMCSGRrAwMDAkKdiaW5kS2V5m6FsmKhiYXNlUmVzdK5XUkFQX0JJTkRfRkxBR7JXUkFQX0JJTkRfS0VZX0ZMQUeucmVwbGFjZUhvbGRlcnOpZ2V0SG9sZGVyp2JpbmRLZXmxV1JBUF9QQVJUSUFMX0ZMQUeqY3JlYXRlV3JhcMMcIZQdHh8gwMDAwJioYmFzZVJlc3SqY3JlYXRlV3JhcKlnZXRIb2xkZXKucmVwbGFjZUhvbGRlcnOuV1JBUF9CSU5EX0ZMQUeyV1JBUF9CSU5EX0tFWV9GTEFHsVdSQVBfUEFSVElBTF9GTEFHp2JpbmRLZXncACOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgAIwBTCwpYBFwYJwsKWCQAHwMLClgsKwMDCwpYQCsDAwsKWARgKDcLClgkAC8DCwpYLCcDAwsKWCwnAHsLClgEYDhHCwpYJAA/AwsKWCw7AwMLCli4OwAzCwpY+ARIbwsKWBAQTFcLClgAOwMDCwpY0DsAXwsKWBgQWGMLClgASwMDCwpYDEsAQwsKWBgUZwMLClgARwMDCwpYTEcAIwsKWzQVdARwfwsKWBAAdwMLClgAHwCHCwpYBB8AawsKWIgfAIsLClgkHwMDCwpYDLQTAwsKWFA4gwMLC
====catalogjs annotation end====*/