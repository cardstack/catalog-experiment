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
const _default = (defaults);
export { _default as default };
/*====catalogjs annotation start====
lZSTwqwuL2Rpc3QvNDkuanMBk8KnLi9lcS5qcwWTwqwuL2Rpc3QvNzAuanMJk8KrLi9rZXlzSW4uanMNgadkZWZhdWx0lKFsqF9kZWZhdWx0JcCRkyXAwoioYmFzZVJlc3SboWmQwgLAkgMEwADAp2RlZmF1bHSQomVxm6FpkMIGwJIHCMABwKdkZWZhdWx0kK5pc0l0ZXJhdGVlQ2FsbJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCma2V5c0lum6FpkMIOwJIPEMADwKdkZWZhdWx0kKtvYmplY3RQcm90b5uhbJGmT2JqZWN0whIWkxMUFcDAwMCQrmhhc093blByb3BlcnR5m6FskatvYmplY3RQcm90b8IYG5IZGsDAwMCRq29iamVjdFByb3RvqGRlZmF1bHRzm6FslqhiYXNlUmVzdK5pc0l0ZXJhdGVlQ2FsbKZrZXlzSW6iZXGrb2JqZWN0UHJvdG+uaGFzT3duUHJvcGVydHnCHSCSHh/AwMDAlqhiYXNlUmVzdKJlca5pc0l0ZXJhdGVlQ2FsbKZrZXlzSW6rb2JqZWN0UHJvdG+uaGFzT3duUHJvcGVydHmoX2RlZmF1bHSboWyRqGRlZmF1bHRzwiLAkiMkwMDAwJDcACaWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgAIwAzCwpYBEgYJwsKWCQAHwMLClgsCwMDCwpbM1QLAFcLClgEXCg3CwpYJAAvAwsKWCw7AwMLClsytDsAQwsKWARYOEcLClgkAD8DCwpYLBsDAwsKWzIYGwAjCwpYzARIXwsKWBAATwMLClgALwBbCwpYAC8DAwsKWCAvAGsLClgMQwMDCwpYzARgcwsKWBAAZwMLClgAOwBvCwpYLDsDAwsKWAw8UwMLCls0CpwEdIcLClgQAHsDCwpYACMAgwsKWBAjAwMLClgNfBMDCwpYBASIlwsKWBgEjwMLClgAIwB/CwpYJCMDAwsKWAQ4kwMLC
====catalogjs annotation end====*/