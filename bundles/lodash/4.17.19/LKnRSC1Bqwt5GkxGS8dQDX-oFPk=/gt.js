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
const _default = (gt);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTY1LmpzAZPCrC4vZGlzdC8yNS5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQSwJGTEsDChKZiYXNlR3SboWmQwgLAkgMEwADAp2RlZmF1bHSQuWNyZWF0ZVJlbGF0aW9uYWxPcGVyYXRpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQomd0m6FskrljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9upmJhc2VHdMIKDZILDMDAwMCSpmJhc2VHdLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uqF9kZWZhdWx0m6FskaJndMIPwJIQEcDAwMCQ3AATlgAAAcDCw5YAGAIFwsKWCQADwMLClgsGwMDCwpYBBsDAwsKWARcGCcLClgkAB8DCwpYLGcDAwsKWABnABMLCls0BqgEKDsLClgQAC8DCwpYAAsANwsKWBALAwMLClgMBCMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/