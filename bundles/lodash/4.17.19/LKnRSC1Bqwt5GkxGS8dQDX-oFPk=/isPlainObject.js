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


export { isPlainObject as default };
/*====catalogjs annotation start====
lZOVwqwuL2Rpc3QvODYuanMBwsCVwq0uL2Rpc3QvMTM3LmpzBcLAlcKxLi9pc09iamVjdExpa2UuanMJwsCBp2RlZmF1bHSUoWytaXNQbGFpbk9iamVjdC3AkZMtwMCKqmJhc2VHZXRUYWeboWmQwgLAkgMEwADAp2RlZmF1bHSQrGdldFByb3RvdHlwZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCsaXNPYmplY3RMaWtlm6FpkMIKwJILDMACwKdkZWZhdWx0kKlvYmplY3RUYWeboWyQwg7Akg8QwMDAwJCpZnVuY1Byb3Rvm6FskahGdW5jdGlvbsISFZITFMDAwMCQq29iamVjdFByb3Rvm6FskaZPYmplY3TCFhmSFxjAwMDAkKxmdW5jVG9TdHJpbmeboWyRqWZ1bmNQcm90b8IbH5McHR7AwMDAkalmdW5jUHJvdG+uaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3RvwiEkkiIjwMDAwJGrb2JqZWN0UHJvdG+wb2JqZWN0Q3RvclN0cmluZ5uhbJKsZnVuY1RvU3RyaW5npk9iamVjdMImKZInKMDAwMCRrGZ1bmNUb1N0cmluZ61pc1BsYWluT2JqZWN0m6Fsl6xpc09iamVjdExpa2WqYmFzZUdldFRhZ6lvYmplY3RUYWesZ2V0UHJvdG90eXBlrmhhc093blByb3BlcnR5rGZ1bmNUb1N0cmluZ7BvYmplY3RDdG9yU3RyaW5nwirAkisswMDAwJDcAC6WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwrAwMLClgsKwBDCwpYBGAYJwsKWCQAHwMLClgsMwMDCwpYpDMAjwsKWARwKDcLClgkAC8DCwpYLDMDAwsKWEQzABMLCljIBDhHCwpYEFA/AwsKWAAnAwMLClgsJwAjCwpYuARIawsKWBAATFsLClgAJwBXCwpYACcDAwsKWAxLAwMLClgYAF8DCwpYAC8AZwsKWAAvAwMLClgMQwMDCwpY9ARsgwsKWBAAcwMLClgAMwB/CwpYADMDAwsKWcAzAKMLClgMJFMDCwpYzASElwsKWBAAiwMLClgAOwCTCwpZFDsAewsKWAw8YwMLCljEBJirCwpYEACfAwsKWABDAKcLClg8QwMDCwpYDDR3AwsKWzQJZAystwsKWCQ3ADMLClgkNwMDCwpYDDizAwsI=
====catalogjs annotation end====*/