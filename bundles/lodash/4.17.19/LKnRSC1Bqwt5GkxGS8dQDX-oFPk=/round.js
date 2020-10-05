import { default as createRound } from "./dist/20.js";


/**
 * Computes `number` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */

var round = createRound('round');
const _default = (round);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOrY3JlYXRlUm91bmSboWmQwgLAkgMEwADAp2RlZmF1bHSQpXJvdW5km6FskatjcmVhdGVSb3VuZMIGCZIHCMDAwMCRq2NyZWF0ZVJvdW5kqF9kZWZhdWx0m6FskaVyb3VuZMILwJIMDcDAwMCQn5YAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWAAvAwMLCls0BkAEGCsLClgQAB8DCwpYABcAJwsKWBAXAwMLClgMJBMDCwpYBAQsOwsKWBgEMwMLClgAIwAjCwpYJCMDAwsKWAQ4NwMLC
====catalogjs annotation end====*/