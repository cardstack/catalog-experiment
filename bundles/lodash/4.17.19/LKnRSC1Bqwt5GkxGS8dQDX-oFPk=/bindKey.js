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
const _default = (bindKey);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNDkuanMBk8KsLi9kaXN0LzIzLmpzBZPCrS4vZGlzdC8xMjYuanMJk8KtLi9kaXN0LzEyOS5qcw2Bp2RlZmF1bHSUoWyoX2RlZmF1bHQmwJGTJsDCiahiYXNlUmVzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY3JlYXRlV3JhcJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCpZ2V0SG9sZGVym6FpkMIKwJILDMACwKdkZWZhdWx0kK5yZXBsYWNlSG9sZGVyc5uhaZDCDsCSDxDAA8CnZGVmYXVsdJCuV1JBUF9CSU5EX0ZMQUeboWyQwhLAkhMUwMDAwJCyV1JBUF9CSU5EX0tFWV9GTEFHm6FskMIVwJIWF8DAwMCQsVdSQVBfUEFSVElBTF9GTEFHm6FskMIYwJIZGsDAwMCQp2JpbmRLZXmboWyYqGJhc2VSZXN0rldSQVBfQklORF9GTEFHsldSQVBfQklORF9LRVlfRkxBR65yZXBsYWNlSG9sZGVyc6lnZXRIb2xkZXKnYmluZEtlebFXUkFQX1BBUlRJQUxfRkxBR6pjcmVhdGVXcmFwwxwhlB0eHyDAwMDAmKhiYXNlUmVzdKpjcmVhdGVXcmFwqWdldEhvbGRlcq5yZXBsYWNlSG9sZGVyc65XUkFQX0JJTkRfRkxBR7JXUkFQX0JJTkRfS0VZX0ZMQUexV1JBUF9QQVJUSUFMX0ZMQUenYmluZEtleahfZGVmYXVsdJuhbJGnYmluZEtlecIjwJIkJcDAwMCQ3AAnlgAAAcDCw5YAFwIFwsKWCQADwMLClgsIwMDCwpYACMAUwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWEArAwMLClgEYCg3CwpYJAAvAwsKWCwnAwMLClgsJwB7CwpYBGA4RwsKWCQAPwMLClgsOwMDCwpYuDsAMwsKWPgESG8LClgQEExXCwpYADsDAwsKWNA7AF8LClgYEFhjCwpYAEsDAwsKWAxLAEMLClgYFGcDCwpYAEcDAwsKWExHACMLCls0FXQEcH8LClgQAHcDCwpYAB8AhwsKWAQfAGsLCliIHwCLCwpYEB8DAwsKWAy0EwMLClhMBIybCwpYGASTAwsKWAAjAIMLClgkIwMDCwpYBDiXAwsI=
====catalogjs annotation end====*/