import { default as baseRest } from "./dist/49.js";
import { default as eq } from "./eq.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as keysIn } from "./keysIn.js";





/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */

var defaults = baseRest(function (object, sources) {
  object = Object(object);
  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

export { defaults as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvNDkuanMBwsCVwqcuL2VxLmpzBcLAlcKsLi9kaXN0LzcwLmpzCcLAlcKrLi9rZXlzSW4uanMNwsCBp2RlZmF1bHSUoWyoZGVmYXVsdHMhwJGTIcDAh6hiYXNlUmVzdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCiZXGboWmQwgbAkgcIwAHAp2RlZmF1bHSQrmlzSXRlcmF0ZWVDYWxsm6FpkMIKwJILDMACwKdkZWZhdWx0kKZrZXlzSW6boWmQwg7Akg8QwAPAp2RlZmF1bHSQq29iamVjdFByb3Rvm6FskaZPYmplY3TCEhaTExQVwMDAwJCuaGFzT3duUHJvcGVydHmboWyRq29iamVjdFByb3RvwhgbkhkawMDAwJGrb2JqZWN0UHJvdG+oZGVmYXVsdHOboWyWqGJhc2VSZXN0rmlzSXRlcmF0ZWVDYWxspmtleXNJbqJlcatvYmplY3RQcm90b65oYXNPd25Qcm9wZXJ0ecIdIJIeH8DAwMCWqGJhc2VSZXN0omVxrmlzSXRlcmF0ZWVDYWxspmtleXNJbqtvYmplY3RQcm90b65oYXNPd25Qcm9wZXJ0edwAIpYAAAHAwsOWABcCBcLClgkAA8DCwpYLCMDAwsKWAAjADMLClgESBgnCwpYJAAfAwsKWCwLAwMLClszVAsAVwsKWARcKDcLClgkAC8DCwpYLDsDAwsKWzK0OwBDCwpYBFg4RwsKWCQAPwMLClgsGwMDCwpbMhgbACMLCljMBEhfCwpYEABPAwsKWAAvAFsLClgALwMDCwpYIC8AawsKWAxDAwMLCljMBGBzCwpYEABnAwsKWAA7AG8LClgsOwMDCwpYDDxTAwsKWzQKnAR0hwsKWBAAewMLClgAIwCDCwpYJCMDAwsKWA18EwMLClgIOH8DCwg==
====catalogjs annotation end====*/