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
const _default = (lt);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTY2LmpzAZPCrC4vZGlzdC8yNS5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQSwJGTEsDChKZiYXNlTHSboWmQwgLAkgMEwADAp2RlZmF1bHSQuWNyZWF0ZVJlbGF0aW9uYWxPcGVyYXRpb26boWmQwgbAkgcIwAHAp2RlZmF1bHSQomx0m6FskrljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9upmJhc2VMdMIKDZILDMDAwMCSpmJhc2VMdLljcmVhdGVSZWxhdGlvbmFsT3BlcmF0aW9uqF9kZWZhdWx0m6FskaJsdMIPwJIQEcDAwMCQ3AATlgAAAcDCw5YAGAIFwsKWCQADwMLClgsGwMDCwpYBBsDAwsKWARcGCcLClgkAB8DCwpYLGcDAwsKWABnABMLCls0BpAEKDsLClgQAC8DCwpYAAsANwsKWBALAwMLClgMBCMDCwpYBAQ8SwsKWBgEQwMLClgAIwAzCwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/