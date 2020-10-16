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

export { isBuffer as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvOTMuanMBwsCVwq4uL3N0dWJGYWxzZS5qcwXCwIGnZGVmYXVsdJShbKhpc0J1ZmZlcirAkZMqwMCIpHJvb3SboWmQwgLAkgMEwADAp2RlZmF1bHSQqXN0dWJGYWxzZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCrZnJlZUV4cG9ydHOboWyRp2V4cG9ydHPCCg6TCwwNwMDAwJCqZnJlZU1vZHVsZZuhbJKrZnJlZUV4cG9ydHOmbW9kdWxlwhAUkxESE8DAwMCRq2ZyZWVFeHBvcnRzrW1vZHVsZUV4cG9ydHOboWySqmZyZWVNb2R1bGWrZnJlZUV4cG9ydHPCFhmSFxjAwMDAkqtmcmVlRXhwb3J0c6pmcmVlTW9kdWxlpkJ1ZmZlcpuhbJOtbW9kdWxlRXhwb3J0c6Ryb290qXVuZGVmaW5lZMIbH5McHR7AwMDAkqRyb290rW1vZHVsZUV4cG9ydHOubmF0aXZlSXNCdWZmZXKboWySpkJ1ZmZlcql1bmRlZmluZWTCISSSIiPAwMDAkaZCdWZmZXKoaXNCdWZmZXKboWySrm5hdGl2ZUlzQnVmZmVyqXN0dWJGYWxzZcImKZInKMDAwMCSqXN0dWJGYWxzZa5uYXRpdmVJc0J1ZmZlctwAK5YAAAHAwsOWABcCBcLClgkAA8DCwpYLBMDAwsKWAwTAwMLClgEZBgnCwpYJAAfAwsKWCwnAwMLClgQJwMDCwpYsAQoPwsKWBAALwMLClgALwA7CwpYAC8DAwsKWDQvAwMLClgNFwMDCwpYoARAVwsKWBAARwMLClgAKwBTCwpYACsATwsKWBArADcLClgNFDMDCwpZBARYawsKWBAAXwMLClgANwBnCwpYADcAEwsKWAwASwMLCliQBGyDCwpYEABzAwsKWAAbAH8LClgAGwB7CwpYDBsDAwsKWAxMYwMLCllsBISXCwpYEACLAwsKWAA7AJMLClgAOwAjCwpYDFR3AwsKWzQFNASYqwsKWBAAnwMLClgAIwCnCwpYJCMDAwsKWAwAjwMLClgIOKMDCwg==
====catalogjs annotation end====*/