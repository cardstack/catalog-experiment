import { default as baseKeys } from "./dist/132.js";
import { default as getTag } from "./dist/45.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as stringSize } from "./dist/144.js";






/** `Object#toString` result references. */

var mapTag = '[object Map]',
    setTag = '[object Set]';
/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */

function size(collection) {
  if (collection == null) {
    return 0;
  }

  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }

  var tag = getTag(collection);

  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }

  return baseKeys(collection).length;
}

const _default = (size);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTMyLmpzAZPCrC4vZGlzdC80NS5qcwWTwrAuL2lzQXJyYXlMaWtlLmpzCZPCrS4vaXNTdHJpbmcuanMNk8KtLi9kaXN0LzE0NC5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQjwJGTI8DCiahiYXNlS2V5c5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCmZ2V0VGFnm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtpc0FycmF5TGlrZZuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoaXNTdHJpbmeboWmQwg7Akg8QwAPAp2RlZmF1bHSQqnN0cmluZ1NpemWboWmQwhLAkhMUwATAp2RlZmF1bHSQpm1hcFRhZ5uhbJDCFsCSFxjAwMDAkKZzZXRUYWeboWyQwhnAkhobwMDAwJCkc2l6ZZuhbJeraXNBcnJheUxpa2WoaXNTdHJpbmeqc3RyaW5nU2l6ZaZnZXRUYWembWFwVGFnpnNldFRhZ6hiYXNlS2V5c8IcwJIdHsDAwMCQqF9kZWZhdWx0m6FskaRzaXplwiDAkiEiwMDAwJDcACSWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLCli4IwMDCwpYBFwYJwsKWCQAHwMLClgsGwMDCwpYzBsAYwsKWARsKDcLClgkAC8DCwpYLC8DAwsKWRAvAEMLClgEYDhHCwpYJAA/AwsKWCwjAwMLClhsIwBTCwpYBGBIVwsKWCQATwMLClgsKwMDCwpYPCsAIwsKWNAEWHMLClgQRFxnCwpYABsDAwsKWHAbAG8LClgYRGsDCwpYABsDAwsKWCwbABMLCls0B3xYdH8LClgkEwAzCwpYEBMDAwsKWAgEgI8LClgYBIcDCwpYACMAewsKWCQjAwMLClgEOIsDCwg==
====catalogjs annotation end====*/