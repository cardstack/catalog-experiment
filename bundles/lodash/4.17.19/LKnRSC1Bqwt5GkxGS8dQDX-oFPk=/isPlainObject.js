import { default as baseGetTag } from "./dist/86.js";
import { default as getPrototype } from "./dist/137.js";
import { default as isObjectLike } from "./isObjectLike.js";




/** `Object#toString` result references. */

var objectTag = '[object Object]';
/** Used for built-in method references. */

var funcProto = Function.prototype,
    objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString = funcToString.call(Object);
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */

function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }

  var proto = getPrototype(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

const _default = (isPlainObject);
export { _default as default };
/*====catalogjs annotation start====
lZOTwqwuL2Rpc3QvODYuanMBk8KtLi9kaXN0LzEzNy5qcwWTwrEuL2lzT2JqZWN0TGlrZS5qcwmBp2RlZmF1bHSUoWyoX2RlZmF1bHQxwJGTMcDCi6piYXNlR2V0VGFnm6FpkMICwJIDBMAAwKdkZWZhdWx0kKxnZXRQcm90b3R5cGWboWmQwgbAkgcIwAHAp2RlZmF1bHSQrGlzT2JqZWN0TGlrZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCpb2JqZWN0VGFnm6FskMIOwJIPEMDAwMCQqWZ1bmNQcm90b5uhbJGoRnVuY3Rpb27CEhWSExTAwMDAkKtvYmplY3RQcm90b5uhbJGmT2JqZWN0whYZkhcYwMDAwJCsZnVuY1RvU3RyaW5nm6FskalmdW5jUHJvdG/CGx+THB0ewMDAwJGpZnVuY1Byb3Rvrmhhc093blByb3BlcnR5m6FskatvYmplY3RQcm90b8IhJJIiI8DAwMCRq29iamVjdFByb3RvsG9iamVjdEN0b3JTdHJpbmeboWySrGZ1bmNUb1N0cmluZ6ZPYmplY3TCJimSJyjAwMDAkaxmdW5jVG9TdHJpbmetaXNQbGFpbk9iamVjdJuhbJesaXNPYmplY3RMaWtlqmJhc2VHZXRUYWepb2JqZWN0VGFnrGdldFByb3RvdHlwZa5oYXNPd25Qcm9wZXJ0eaxmdW5jVG9TdHJpbmewb2JqZWN0Q3RvclN0cmluZ8IqwJIrLMDAwMCQqF9kZWZhdWx0m6Fska1pc1BsYWluT2JqZWN0wi7Aki8wwMDAwJDcADKWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwBDCwpYBGAYJwsKWCQAHwMLClgsMwMDCwpYpDMAjwsKWARwKDcLClgkAC8DCwpYLDMDAwsKWEQzABMLCljIBDhHCwpYEFA/AwsKWAAnAwMLClgsJwAjCwpYuARIawsKWBAATFsLClgAJwBXCwpYACcDAwsKWAxLAwMLClgYAF8DCwpYAC8AZwsKWAAvAwMLClgMQwMDCwpY9ARsgwsKWBAAcwMLClgAMwB/CwpYADMDAwsKWcAzAKMLClgMJFMDCwpYzASElwsKWBAAiwMLClgAOwCTCwpZFDsAewsKWAw8YwMLCljEBJirCwpYEACfAwsKWABDAKcLClg8QwMDCwpYDDR3AwsKWzQJZAystwsKWCQ3ADMLClgQNwMDCwpYCAS4xwsKWBgEvwMLClgAIwCzCwpYJCMDAwsKWAQ4wwMLC
====catalogjs annotation end====*/