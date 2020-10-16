import { default as assignValue } from "./dist/55.js";
import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isPrototype } from "./dist/133.js";
import { default as keys } from "./keys.js";







/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */

var assign = createAssigner(function (object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }

  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

export { assign as default };
/*====catalogjs annotation start====
lZaVwqwuL2Rpc3QvNTUuanMBwsCVwqwuL2Rpc3QvNTQuanMFwsCVwqwuL2Rpc3QvNDguanMJwsCVwrAuL2lzQXJyYXlMaWtlLmpzDcLAlcKtLi9kaXN0LzEzMy5qcxHCwJXCqS4va2V5cy5qcxXCwIGnZGVmYXVsdJShbKZhc3NpZ24owJGTKMDAiathc3NpZ25WYWx1ZZuhaZDCAsCSAwTAAMCnZGVmYXVsdJCqY29weU9iamVjdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCuY3JlYXRlQXNzaWduZXKboWmQwgrAkgsMwALAp2RlZmF1bHSQq2lzQXJyYXlMaWtlm6FpkMIOwJIPEMADwKdkZWZhdWx0kKtpc1Byb3RvdHlwZZuhaZDCEsCSExTABMCnZGVmYXVsdJCka2V5c5uhaZDCFsCSFxjABcCnZGVmYXVsdJCrb2JqZWN0UHJvdG+boWyRpk9iamVjdMIaHZIbHMDAwMCQrmhhc093blByb3BlcnR5m6FskatvYmplY3RQcm90b8IfIpIgIcDAwMCRq29iamVjdFByb3RvpmFzc2lnbpuhbJeuY3JlYXRlQXNzaWduZXKraXNQcm90b3R5cGWraXNBcnJheUxpa2WqY29weU9iamVjdKRrZXlzrmhhc093blByb3BlcnR5q2Fzc2lnblZhbHVlwiQnkiUmwMDAwJerYXNzaWduVmFsdWWqY29weU9iamVjdK5jcmVhdGVBc3NpZ25lcqtpc0FycmF5TGlrZatpc1Byb3RvdHlwZaRrZXlzrmhhc093blByb3BlcnR53AAplgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYcC8DAwsKWARcGCcLClgkAB8DCwpYLCsDAwsKWEArAGMLClgEXCg3CwpYJAAvAwsKWCw7AwMLClgAOwBTCwpYBGw4RwsKWCQAPwMLClgsLwMDCwpYMC8AIwsKWARgSFcLClgkAE8DCwpYLC8DAwsKWIwvAEMLClgEUFhnCwpYJABfAwsKWCwTAwMLClgkEwCHCwpY1ARoewsKWBAAbwMLClgALwB3CwpYAC8DAwsKWAxDAwMLCljMBHyPCwpYEACDAwsKWAA7AIsLClkgOwATCwpYDDxzAwsKWzQMjASQowsKWBAAlwMLClgAGwCfCwpYJBsDAwsKWAygMwMLClgIOJsDCwg==
====catalogjs annotation end====*/