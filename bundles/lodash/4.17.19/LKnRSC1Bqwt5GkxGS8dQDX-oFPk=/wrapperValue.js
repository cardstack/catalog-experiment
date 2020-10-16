import { default as baseWrapperValue } from "./dist/102.js";


/**
 * Executes the chain sequence to resolve the unwrapped value.
 *
 * @name value
 * @memberOf _
 * @since 0.1.0
 * @alias toJSON, valueOf
 * @category Seq
 * @returns {*} Returns the resolved unwrapped value.
 * @example
 *
 * _([1, 2, 3]).value();
 * // => [1, 2, 3]
 */

function wrapperValue() {
  return baseWrapperValue(this.__wrapped__, this.__actions__);
}


export { wrapperValue as default };
/*====catalogjs annotation start====
lZGVwq0uL2Rpc3QvMTAyLmpzAcLAgadkZWZhdWx0lKFsrHdyYXBwZXJWYWx1ZQjAkZMIwMCCsGJhc2VXcmFwcGVyVmFsdWWboWmQwgLAkgMEwADAp2RlZmF1bHSQrHdyYXBwZXJWYWx1ZZuhbJGwYmFzZVdyYXBwZXJWYWx1ZcIFwJIGB8DAwMCQmZYAAAHAwsOWABgCBcLClgkAA8DCwpYLEMDAwsKWDhDAwMLCls0BGCcGCMLClgkMwATCwpYJDMDAwsKWAw4HwMLC
====catalogjs annotation end====*/