import { default as baseLt } from "./dist/166.js";
import { default as createRelationalOperation } from "./dist/25.js";



/**
 * Checks if `value` is less than `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 * @see _.gt
 * @example
 *
 * _.lt(1, 3);
 * // => true
 *
 * _.lt(3, 3);
 * // => false
 *
 * _.lt(3, 1);
 * // => false
 */

var lt = createRelationalOperation(baseLt);

export { lt as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTY2LmpzAcLAlcKsLi9kaXN0LzI1LmpzBcLAgadkZWZhdWx0lKFsomx0DsCRkw7AwIOmYmFzZUx0m6FpkMICwJIDBMAAwKdkZWZhdWx0kLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9um6FpkMIGwJIHCMABwKdkZWZhdWx0kKJsdJuhbJK5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbqZiYXNlTHTCCg2SCwzAwMDAkqZiYXNlTHS5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbp+WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwbAwMLClgEGwMDCwpYBFwYJwsKWCQAHwMLClgsZwMDCwpYAGcAEwsKWzQGkAQoOwsKWBAALwMLClgACwA3CwpYJAsDAwsKWAwEIwMLClgIODMDCwg==
====catalogjs annotation end====*/