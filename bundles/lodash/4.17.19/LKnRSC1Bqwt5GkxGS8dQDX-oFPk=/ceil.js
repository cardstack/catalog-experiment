import { default as createRound } from "./dist/20.js";


/**
 * Computes `number` rounded up to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round up.
 * @param {number} [precision=0] The precision to round up to.
 * @returns {number} Returns the rounded up number.
 * @example
 *
 * _.ceil(4.006);
 * // => 5
 *
 * _.ceil(6.004, 2);
 * // => 6.01
 *
 * _.ceil(6040, -2);
 * // => 6100
 */

var ceil = createRound('ceil');

export { ceil as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjAuanMBwsCBp2RlZmF1bHSUoWykY2VpbArAkZMKwMCCq2NyZWF0ZVJvdW5km6FpkMICwJIDBMAAwKdkZWZhdWx0kKRjZWlsm6FskatjcmVhdGVSb3VuZMIGCZIHCMDAwMCRq2NyZWF0ZVJvdW5km5YAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWAAvAwMLCls0BmQEGCsLClgQAB8DCwpYABMAJwsKWCQTAwMLClgMIBMDCwpYCDgjAwsI=
====catalogjs annotation end====*/