import { default as baseGt } from "./dist/165.js";
import { default as createRelationalOperation } from "./dist/25.js";



/**
 * Checks if `value` is greater than `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 * @see _.lt
 * @example
 *
 * _.gt(3, 1);
 * // => true
 *
 * _.gt(3, 3);
 * // => false
 *
 * _.gt(1, 3);
 * // => false
 */

var gt = createRelationalOperation(baseGt);

export { gt as default };
/*====catalogjs annotation start====
lZKVwq0uL2Rpc3QvMTY1LmpzAcLAlcKsLi9kaXN0LzI1LmpzBcLAgadkZWZhdWx0lKFsomd0DsCRkw7AwIOmYmFzZUd0m6FpkMICwJIDBMAAwKdkZWZhdWx0kLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9um6FpkMIGwJIHCMABwKdkZWZhdWx0kKJndJuhbJK5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbqZiYXNlR3TCCg2SCwzAwMDAkqZiYXNlR3S5Y3JlYXRlUmVsYXRpb25hbE9wZXJhdGlvbp+WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwbAwMLClgEGwMDCwpYBFwYJwsKWCQAHwMLClgsZwMDCwpYAGcAEwsKWzQGqAQoOwsKWBAALwMLClgACwA3CwpYJAsDAwsKWAwEIwMLClgIODMDCwg==
====catalogjs annotation end====*/