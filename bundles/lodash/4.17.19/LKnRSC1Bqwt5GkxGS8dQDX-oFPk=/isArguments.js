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
lZKTwqwuL2Rpc3QvODYuanMBk8KxLi9pc09iamVjdExpa2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0L8CRky/AwoqqYmFzZUdldFRhZ5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIGwJMHCAnAAcCnZGVmYXVsdJCnYXJnc1RhZ5uhbJDCC8CSDA3AwMDAkLBiYXNlSXNBcmd1bWVudHMwm6Fsk6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6dhcmdzVGFnwg7Akg8QwMDAwJCvYmFzZUlzQXJndW1lbnRzm6FskbBiYXNlSXNBcmd1bWVudHMwwhLAkxMUFcDAwMCQq29iamVjdFByb3Rvm6FskaZPYmplY3TCFxuTGBkawMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3Rvwh0gkh4fwMDAwJGrb2JqZWN0UHJvdG+0cHJvcGVydHlJc0VudW1lcmFibGWboWyRq29iamVjdFByb3RvwiIlkiMkwMDAwJGrb2JqZWN0UHJvdG+raXNBcmd1bWVudHOboWyUr2Jhc2VJc0FyZ3VtZW50c6xpc09iamVjdExpa2WuaGFzT3duUHJvcGVydHm0cHJvcGVydHlJc0VudW1lcmFibGXCJyqSKCnAwMDAlKxpc09iamVjdExpa2WvYmFzZUlzQXJndW1lbnRzrmhhc093blByb3BlcnR5tHByb3BlcnR5SXNFbnVtZXJhYmxlqF9kZWZhdWx0m6Fskatpc0FyZ3VtZW50c8IswJItLsDAwMCQ3AAwlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpYLCsANwsKWARwGCsLClgkAB8DCwpYLDMDAwsKWEwzABMLClh8MwB/CwpYxAQsOwsKWBBcMwMLClgAHwMDCwpYLB8DAwsKWzLoDDxHCwpYJEMAIwsKWBBDAwMLClgIBEhbCwpYGARPAwsKWAA/AEMLClgAPwBXCwpYqD8AJwsKWMQEXHMLClgQAGMDCwpYAC8AbwsKWAAvAwMLClgALwMDCwpYDEMDAwsKWMwEdIcLClgQAHsDCwpYADsAgwsKWCw7AJMLClgMPGcDCwpYkASImwsKWBAAjwMLClgAUwCXCwpYbFMDAwsKWAxUawMLCls0BhQEnK8LClgQAKMDCwpYAC8AqwsKWBAvAwMLClgMZFMDCwpYBASwvwsKWBgEtwMLClgAIwCnCwpYJCMDAwsKWAQ4uwMLC
====catalogjs annotation end====*/