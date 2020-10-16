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

function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}





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

export { isArguments as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvODYuanMBwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwXCwIGnZGVmYXVsdJShbKtpc0FyZ3VtZW50cyfAkZMnwMCIqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCBsCTBwgJwAHAp2RlZmF1bHSQp2FyZ3NUYWeboWyQwgvAkgwNwMDAwJCvYmFzZUlzQXJndW1lbnRzm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6dhcmdzVGFnwg7Akw8QEZLZXmh0dHBzOi8vY2F0YWxvZ2pzLmNvbS9wa2dzL25wbS9sb2Rhc2gvNC4xNy4xOS9MS25SU0MxQnF3dDVHa3hHUzhkUURYLW9GUGs9L19iYXNlSXNBcmd1bWVudHMuanOnZGVmYXVsdMDAwJCrb2JqZWN0UHJvdG+boWyRpk9iamVjdMITF5MUFRbAwMDAkK5oYXNPd25Qcm9wZXJ0eZuhbJGrb2JqZWN0UHJvdG/CGRySGhvAwMDAkatvYmplY3RQcm90b7Rwcm9wZXJ0eUlzRW51bWVyYWJsZZuhbJGrb2JqZWN0UHJvdG/CHiGSHyDAwMDAkatvYmplY3RQcm90b6tpc0FyZ3VtZW50c5uhbJSvYmFzZUlzQXJndW1lbnRzrGlzT2JqZWN0TGlrZa5oYXNPd25Qcm9wZXJ0ebRwcm9wZXJ0eUlzRW51bWVyYWJsZcIjJpIkJcDAwMCUrGlzT2JqZWN0TGlrZa9iYXNlSXNBcmd1bWVudHOuaGFzT3duUHJvcGVydHm0cHJvcGVydHlJc0VudW1lcmFibGXcACiWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwA3CwpYBHAYKwsKWCQAHwMLClgsMwMDCwpYTDMAEwsKWHwzAG8LCljEBCw7CwpYEFwzAwsKWAAfAwMLClgsHwMDCwpbMugMPEsLClgkPwAjCwpYAD8ARwsKWKg/ACcLCljMBExjCwpYEABTAwsKWAAvAF8LClgALwMDCwpYAC8DAwsKWAxDAwMLCljMBGR3CwpYEABrAwsKWAA7AHMLClgsOwCDCwpYDDxXAwsKWJAEeIsLClgQAH8DCwpYAFMAhwsKWGxTAwMLClgMVFsDCwpbNAYUBIyfCwpYEACTAwsKWAAvAJsLClgkLwMDCwpYDGRDAwsKWAg4lwMLC
====catalogjs annotation end====*/