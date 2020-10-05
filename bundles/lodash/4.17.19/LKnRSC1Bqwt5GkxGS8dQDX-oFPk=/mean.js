import { default as baseMean } from "./dist/167.js";
import { default as identity } from "./identity.js";



/**
 * Computes the mean of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the mean.
 * @example
 *
 * _.mean([4, 2, 8, 6]);
 * // => 5
 */

function mean(array) {
  return baseMean(array, identity);
}

const _default = (mean);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTY3LmpzAZPCrS4vaWRlbnRpdHkuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EMCRkxDAwoSoYmFzZU1lYW6boWmQwgLAkgMEwADAp2RlZmF1bHSQqGlkZW50aXR5m6FpkMIGwJIHCMABwKdkZWZhdWx0kKRtZWFum6FskqhiYXNlTWVhbqhpZGVudGl0ecIJwJIKC8DAwMCQqF9kZWZhdWx0m6FskaRtZWFuwg3Akg4PwMDAwJDcABGWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwjAwMLClhMIwAjCwpYBGAYJwsKWCQAHwMLClgsIwMDCwpYICMDAwsKWzQEIBAoMwsKWCQTABMLClgQEwMDCwpYCAQ0QwsKWBgEOwMLClgAIwAvCwpYJCMDAwsKWAQ4PwMLC
====catalogjs annotation end====*/