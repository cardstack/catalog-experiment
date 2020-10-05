import { default as createRound } from "./dist/20.js";


/**
 * Computes `number` rounded down to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round down.
 * @param {number} [precision=0] The precision to round down to.
 * @returns {number} Returns the rounded down number.
 * @example
 *
 * _.floor(4.006);
 * // => 4
 *
 * _.floor(0.046, 2);
 * // => 0.04
 *
 * _.floor(4060, -2);
 * // => 4000
 */

var floor = createRound('floor');
const _default = (floor);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOrY3JlYXRlUm91bmSboWmQwgLAkgMEwADAp2RlZmF1bHSQpWZsb29ym6FskatjcmVhdGVSb3VuZMIGCZIHCMDAwMCRq2NyZWF0ZVJvdW5kqF9kZWZhdWx0m6FskaVmbG9vcsILwJIMDcDAwMCQn5YAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWAAvAwMLCls0BpAEGCsLClgQAB8DCwpYABcAJwsKWBAXAwMLClgMJBMDCwpYBAQsOwsKWBgEMwMLClgAIwAjCwpYJCMDAwsKWAQ4NwMLC
====catalogjs annotation end====*/