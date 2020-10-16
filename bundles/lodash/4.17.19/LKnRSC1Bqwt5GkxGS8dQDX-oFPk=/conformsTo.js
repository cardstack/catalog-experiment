import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";



/**
 * Checks if `object` conforms to `source` by invoking the predicate
 * properties of `source` with the corresponding property values of `object`.
 *
 * **Note:** This method is equivalent to `_.conforms` when `source` is
 * partially applied.
 *
 * @static
 * @memberOf _
 * @since 4.14.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property predicates to conform to.
 * @returns {boolean} Returns `true` if `object` conforms, else `false`.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 *
 * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
 * // => true
 *
 * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
 * // => false
 */

function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}


export { conformsTo as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTU3LmpzAcLAlcKpLi9rZXlzLmpzBcLAgadkZWZhdWx0lKFsqmNvbmZvcm1zVG8MwJGTDMDAg65iYXNlQ29uZm9ybXNUb5uhaZDCAsCSAwTAAMCnZGVmYXVsdJCka2V5c5uhaZDCBsCSBwjAAcCnZGVmYXVsdJCqY29uZm9ybXNUb5uhbJKuYmFzZUNvbmZvcm1zVG+ka2V5c8IJwJIKC8DAwMCQnZYAAAHAwsOWABgCBcLClgkAA8DCwpYLDsDAwsKWLg7ACMLClgEUBgnCwpYJAAfAwsKWCwTAwMLClhEEwMDCwpbNAt4MCgzCwpYJCsAEwsKWCQrAwMLClgMOC8DCwg==
====catalogjs annotation end====*/