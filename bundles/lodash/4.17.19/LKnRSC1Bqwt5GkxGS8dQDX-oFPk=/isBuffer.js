import { default as root } from "./dist/93.js";
import { default as stubFalse } from "./stubFalse.js";



/** Detect free variable `exports`. */

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */

var Buffer = moduleExports ? root.Buffer : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */

var isBuffer = nativeIsBuffer || stubFalse;
const _default = (isBuffer);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvOTMuanMBk8KuLi9zdHViRmFsc2UuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0LsCRky7Awomkcm9vdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCpc3R1YkZhbHNlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKtmcmVlRXhwb3J0c5uhbJGnZXhwb3J0c8IKDpMLDA3AwMDAkKpmcmVlTW9kdWxlm6FskqtmcmVlRXhwb3J0c6Ztb2R1bGXCEBSTERITwMDAwJGrZnJlZUV4cG9ydHOtbW9kdWxlRXhwb3J0c5uhbJKqZnJlZU1vZHVsZatmcmVlRXhwb3J0c8IWGZIXGMDAwMCSq2ZyZWVFeHBvcnRzqmZyZWVNb2R1bGWmQnVmZmVym6Fsk61tb2R1bGVFeHBvcnRzpHJvb3SpdW5kZWZpbmVkwhsfkxwdHsDAwMCSpHJvb3StbW9kdWxlRXhwb3J0c65uYXRpdmVJc0J1ZmZlcpuhbJKmQnVmZmVyqXVuZGVmaW5lZMIhJJIiI8DAwMCRpkJ1ZmZlcqhpc0J1ZmZlcpuhbJKubmF0aXZlSXNCdWZmZXKpc3R1YkZhbHNlwiYpkicowMDAwJKpc3R1YkZhbHNlrm5hdGl2ZUlzQnVmZmVyqF9kZWZhdWx0m6Fskahpc0J1ZmZlcsIrwJIsLcDAwMCQ3AAvlgAAAcDCw5YAFwIFwsKWCQADwMLClgsEwMDCwpYDBMDAwsKWARkGCcLClgkAB8DCwpYLCcDAwsKWBAnAwMLCliwBCg/CwpYEAAvAwsKWAAvADsLClgALwMDCwpYNC8DAwsKWA0XAwMLCligBEBXCwpYEABHAwsKWAArAFMLClgAKwBPCwpYECsANwsKWA0UMwMLClkEBFhrCwpYEABfAwsKWAA3AGcLClgANwATCwpYDABLAwsKWJAEbIMLClgQAHMDCwpYABsAfwsKWAAbAHsLClgMGwMDCwpYDExjAwsKWWwEhJcLClgQAIsDCwpYADsAkwsKWAA7ACMLClgMVHcDCwpbNAU0BJirCwpYEACfAwsKWAAjAKcLClgQIwMDCwpYDACPAwsKWAQErLsLClgYBLMDCwpYACMAowsKWCQjAwMLClgEOLcDCwg==
====catalogjs annotation end====*/