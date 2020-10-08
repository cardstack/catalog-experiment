import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";



/** `Object#toString` result references. */

var argsTag = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments0(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

const baseIsArguments = (baseIsArguments0);



/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */

var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
const _default = (isArguments);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0L8CRky/AwoqqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJMHCAnAAcCnZGVmYXVsdJCnYXJnc1RhZ5uhbJDCC8CSDA3AwMDAkLBiYXNlSXNBcmd1bWVudHMwm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6dhcmdzVGFnwg7Akg8QwMDAwJCvYmFzZUlzQXJndW1lbnRzm6FskbBiYXNlSXNBcmd1bWVudHMwwhLAkxMUFZLZXmh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlSXNBcmd1bWVudHMuanOnZGVmYXVsdMDAwJCrb2JqZWN0UHJvdG+boWyRpk9iamVjdMIXG5MYGRrAwMDAkK5oYXNPd25Qcm9wZXJ0eZuhbJGrb2JqZWN0UHJvdG/CHSCSHh/AwMDAkatvYmplY3RQcm90b7Rwcm9wZXJ0eUlzRW51bWVyYWJsZZuhbJGrb2JqZWN0UHJvdG/CIiWSIyTAwMDAkatvYmplY3RQcm90b6tpc0FyZ3VtZW50c5uhbJSvYmFzZUlzQXJndW1lbnRzrGlzT2JqZWN0TGlrZa5oYXNPd25Qcm9wZXJ0ebRwcm9wZXJ0eUlzRW51bWVyYWJsZcInKpIoKcDAwMCUrGlzT2JqZWN0TGlrZa9iYXNlSXNBcmd1bWVudHOuaGFzT3duUHJvcGVydHm0cHJvcGVydHlJc0VudW1lcmFibGWoX2RlZmF1bHSboWyRq2lzQXJndW1lbnRzwizAki0uwMDAwJDcADCWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwA3CwpYBHAYKwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWHwzAH8LCljEBCw7CwpYEFwzAwsKWAAfAwMLClgsHwMDCwpbMugMPEcLClgkQwAjCwpYEEMDAwsKWAgESFsLClgYBE8DCwpYAD8AQwsKWAA/AFcLClioPwAnCwpYxARccwsKWBAAYwMLClgALwBvCwpYAC8DAwsKWAAvAwMLClgMQwMDCwpYzAR0hwsKWBAAewMLClgAOwCDCwpYLDsAkwsKWAw8ZwMLCliQBIibCwpYEACPAwsKWABTAJcLClhsUwMDCwpYDFRrAwsKWzQGFAScrwsKWBAAowMLClgALwCrCwpYEC8DAwsKWAxkUwMLClgEBLC/CwpYGAS3AwsKWAAjAKcLClgkIwMDCwpYBDi7AwsI=
====catalogjs annotation end====*/