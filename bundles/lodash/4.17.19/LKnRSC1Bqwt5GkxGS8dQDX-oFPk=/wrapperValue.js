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

const _default = (wrapperValue);
export { _default as default };
/*====catalogjs annotation start====
lZGTwq0uL2Rpc3QvMTAyLmpzAYGnZGVmYXVsdJShbKhfZGVmYXVsdAzAkZMMwMKDsGJhc2VXcmFwcGVyVmFsdWWboWmQwgLAkgMEwADAp2RlZmF1bHSQrHdyYXBwZXJWYWx1ZZuhbJGwYmFzZVdyYXBwZXJWYWx1ZcIFwJIGB8DAwMCQqF9kZWZhdWx0m6Fskax3cmFwcGVyVmFsdWXCCcCSCgvAwMDAkJ2WAAABwMLDlgAYAgXCwpYJAAPAwsKWCxDAwMLClg4QwMDCwpbNARgnBgjCwpYJDMAEwsKWBAzAwMLClgIBCQzCwpYGAQrAwsKWAAjAB8LClgkIwMDCwpYBDgvAwsI=
====catalogjs annotation end====*/